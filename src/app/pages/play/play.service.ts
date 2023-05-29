import { computed, effect, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Country } from '../../core/services/countries.service';
import seedrandom from 'seedrandom';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

export const KEY_INTERPOLATION = '{{0}}';
export const GAME_GUESSES_START_STORAGE_KEY = 'GAME::';
export const GAME_GUESSES_STORAGE_KEY = GAME_GUESSES_START_STORAGE_KEY + KEY_INTERPOLATION + '::guesses';

export type PlayType = 'FLAG' | 'SHAPE';
export const PLAY_TYPE = new InjectionToken<PlayType>('The play type');

@Injectable()
export class PlayService {
  activatedRoute = inject(ActivatedRoute);
  type = inject(PLAY_TYPE);
  datePipe = inject(DatePipe);
  todayTransformed = this.transformDate(new Date());
  seed = this.todayTransformed + this.type;
  key = GAME_GUESSES_STORAGE_KEY.toString().replaceAll(KEY_INTERPOLATION, this.seed);
  countries = toSignal(this.activatedRoute.data.pipe(map((data) => data['countries'] as Country[])), {
    requireSync: true
  });
  guesses = signal(getSavedGuesses(this.key, this.countries()));
  randomNumberInRange = computed(() => Math.floor(seedrandom(this.seed)() * this.countries().length));
  country = computed(() => this.countries()[this.randomNumberInRange()]);
  isGuessed = computed(() => {
    return this.guesses()
      .map((guess) => guess.name)
      .includes(this.country().name);
  });
  isEnded = computed(() => this.isGuessed() || this.guesses().length >= 5);
  onGuesses = effect(() => {
    localStorage.setItem(this.key, JSON.stringify(this.guesses().map((guess) => guess.isoCode)));
  });

  constructor() {
    deletePreviousSavedGuesses(this.todayTransformed);
  }

  guess(guess: Country) {
    this.guesses.update((countries) => [...countries, guess]);
  }

  private transformDate(date: Date) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.datePipe.transform(date, 'shortDate')!;
  }
}

export function getSavedGuesses(key: string, countries: Country[]): Country[] {
  const item = localStorage.getItem(key);
  if (item) {
    const countryIds: string[] = JSON.parse(item);
    return countryIds
      .map((id) => countries.find((country) => country.isoCode === id))
      .filter((country: Country | undefined): country is Country => !!country);
  }
  return [];
}

export function deletePreviousSavedGuesses(seed: string) {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes(GAME_GUESSES_START_STORAGE_KEY)) {
      keys.push(key);
    }
  }
  const gameKeys = keys.filter((key) => key.indexOf(seed) === -1);
  for (let i = 0; i < gameKeys.length; i++) {
    localStorage.removeItem(gameKeys[i]);
  }
}
