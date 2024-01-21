import { computed, effect, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import seedrandom from 'seedrandom';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from '../../core/services/countries.service';

export const KEY_INTERPOLATION = '{{0}}';
export const GAME_GUESSES_START_STORAGE_KEY = 'GAME';
export const STAT_GUESSES_START_STORAGE_KEY = 'STAT';
export const GAME_GUESSES_STORAGE_KEY = `${GAME_GUESSES_START_STORAGE_KEY}::${KEY_INTERPOLATION}::guesses`;
export const STAT_GUESSES_SUCCESS_STORAGE_KEY = `${STAT_GUESSES_START_STORAGE_KEY}::${KEY_INTERPOLATION}::success`;
export const STAT_GUESSES_FAILURE_STORAGE_KEY = `${STAT_GUESSES_START_STORAGE_KEY}::${KEY_INTERPOLATION}::failure`;

export type PlayType = 'FLAG' | 'SHAPE';
export const PLAY_TYPE = new InjectionToken<PlayType>('The play type');

@Injectable({
  providedIn: 'any'
})
export class PlayService {
  activatedRoute = inject(ActivatedRoute);
  type = inject(PLAY_TYPE);
  datePipe = inject(DatePipe);
  http = inject(HttpClient);
  router = inject(Router);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  todayTransformed = this.datePipe.transform(new Date(), 'shortDate')!;
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
  $saveGuess = effect(() => {
    localStorage.setItem(this.key, JSON.stringify(this.guesses().map((guess) => guess.isoCode)));
  });
  $saveStatistics = effect(() => {
    if (this.isEnded()) {
      const key = this.isGuessed() ? STAT_GUESSES_SUCCESS_STORAGE_KEY : STAT_GUESSES_FAILURE_STORAGE_KEY;
      saveStatistics(key.replace(KEY_INTERPOLATION, this.type), this.todayTransformed);
    }
  });

  failures = computed(() => {
    // used for tracking
    this.isEnded();
    return getStatisticsCount(STAT_GUESSES_FAILURE_STORAGE_KEY.replace(KEY_INTERPOLATION, this.type));
  });

  successes = computed(() => {
    // used for tracking
    this.isEnded();
    return getStatisticsCount(STAT_GUESSES_SUCCESS_STORAGE_KEY.replace(KEY_INTERPOLATION, this.type));
  });

  constructor() {
    deletePreviousSavedGuesses(this.todayTransformed);
  }

  updateGuesses(guess: Country) {
    this.guesses.update((countries) => [...countries, guess]);
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
    if (key?.includes(GAME_GUESSES_START_STORAGE_KEY)) {
      keys.push(key);
    }
  }
  const gameKeys = keys.filter((key) => key.indexOf(seed) === -1);
  for (const item of gameKeys) {
    localStorage.removeItem(item);
  }
}

export function saveStatistics(key: string, today: string) {
  const savedIsGuessed: string[] = JSON.parse(localStorage.getItem(key) ?? '[]');
  savedIsGuessed.push(today);
  localStorage.setItem(key, JSON.stringify([...new Set(savedIsGuessed)]));
}

export function getStatisticsCount(key: string) {
  return JSON.parse(localStorage.getItem(key) ?? '[]').length;
}
