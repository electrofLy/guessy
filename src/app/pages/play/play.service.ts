import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import seedrandom from 'seedrandom';
import { DatePipe } from '@angular/common';
import { combineLatest, map, ReplaySubject, scan, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CountriesService, Country } from '../../core/services/countries.service';

export const KEY_INTERPOLATION = '{{0}}';
export const GAME_GUESSES_START_STORAGE_KEY = 'GAME::';
export const GAME_GUESSES_STORAGE_KEY = GAME_GUESSES_START_STORAGE_KEY + KEY_INTERPOLATION + '::guesses';

export type PlayType = 'FLAG' | 'SHAPE';

@Injectable({
  providedIn: 'any'
})
export class PlayService {
  datePipe = inject(DatePipe);
  http = inject(HttpClient);
  router = inject(Router);
  countriesService = inject(CountriesService);

  type$ = new ReplaySubject<PlayType>(1);
  guess$ = new Subject<Country>();

  seed$ = this.type$.pipe(
    map((type) => this.generateSeed(new Date(), type)),
    shareReplay({ refCount: false, bufferSize: 1 })
  );
  guesses$ = combineLatest([this.countriesService.countries$, this.seed$]).pipe(
    switchMap(([countries, seed]) => {
      return this.guess$.pipe(
        scan<Country, Country[]>(
          (acc, value) => {
            return [...acc, value];
          },
          [...getSavedGuesses(this.getKey(seed), countries)]
        ),
        startWith([...getSavedGuesses(this.getKey(seed), countries)]),
        shareReplay({ refCount: false, bufferSize: 1 })
      );
    })
  );
  randomSeedNumber$ = this.seed$.pipe(
    map((seed) => seedrandom(seed)),
    shareReplay({ refCount: false, bufferSize: 1 })
  );
  randomNumber$ = combineLatest([this.countriesService.countries$, this.randomSeedNumber$]).pipe(
    map(([country, randomSeedNumber]) => {
      return Math.floor(randomSeedNumber() * country.length) + 1;
    }),
    shareReplay({ refCount: false, bufferSize: 1 })
  );
  country$ = combineLatest([this.countriesService.countries$, this.randomNumber$]).pipe(
    map((val) => val[0][val[1]]),
    shareReplay({ refCount: false, bufferSize: 1 })
  );
  isGuessed$ = combineLatest([
    this.guesses$.pipe(map((guesses) => guesses.map((guess) => guess.name))),
    this.country$
  ]).pipe(
    map(([guesses, country]) => guesses.includes(country.name)),
    shareReplay({ refCount: false, bufferSize: 1 })
  );
  isEnded$ = combineLatest([this.isGuessed$, this.guesses$.pipe(map((guesses) => guesses.length >= 5))]).pipe(
    map(([isGuessed, guesses]) => isGuessed || guesses),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  constructor() {
    this.onGuessChange();
    deletePreviousSavedGuesses(this.transformDate(new Date()));
  }

  private generateSeed(date: Date, type: PlayType) {
    return this.transformDate(date) + type;
  }

  private transformDate(date: Date) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.datePipe.transform(date, 'shortDate')!;
  }

  private getKey(seed: string) {
    return GAME_GUESSES_STORAGE_KEY.toString().replaceAll(KEY_INTERPOLATION, seed);
  }

  private onGuessChange() {
    combineLatest([this.guesses$, this.seed$])
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(([guesses, seed]) => {
        localStorage.setItem(this.getKey(seed), JSON.stringify(guesses.map((guess) => guess.isoCode)));
      });
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
