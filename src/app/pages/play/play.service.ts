import { computed, effect, inject, Injectable, signal, untracked, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import seedrandom from 'seedrandom';
import { DatePipe } from '@angular/common';
import { combineLatest, filter, map, scan, shareReplay, startWith, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CountriesService, Country } from '../../core/services/countries.service';

export const KEY_INTERPOLATION = '{{0}}';
export const GAME_GUESSES_START_STORAGE_KEY = 'GAME';
export const STAT_GUESSES_START_STORAGE_KEY = 'STAT';
export const GAME_GUESSES_STORAGE_KEY = `${GAME_GUESSES_START_STORAGE_KEY}::${KEY_INTERPOLATION}::guesses`;
export const STAT_GUESSES_SUCCESS_STORAGE_KEY = `${STAT_GUESSES_START_STORAGE_KEY}::${KEY_INTERPOLATION}::success`;
export const STAT_GUESSES_FAILURE_STORAGE_KEY = `${STAT_GUESSES_START_STORAGE_KEY}::${KEY_INTERPOLATION}::failure`;

export type PlayType = 'FLAG' | 'SHAPE';

@Injectable({
  providedIn: 'any'
})
export class PlayService {
  datePipe = inject(DatePipe);
  http = inject(HttpClient);
  router = inject(Router);
  countriesService = inject(CountriesService);

  typeSignal: WritableSignal<PlayType> = signal('FLAG');

  guessSignal: WritableSignal<Country | null> = signal(null);

  guess$ = toObservable(this.guessSignal);

  seedSignal = computed(() => {
    return this.generateSeed(new Date(), this.typeSignal());
  });

  guesses$ = combineLatest([toObservable(this.countriesService.countriesSignal), toObservable(this.seedSignal)]).pipe(
    switchMap(([countries, seed]) => {
      return this.guess$.pipe(
        filter((value): value is Country => {
          return value !== null;
        }),
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

  randomSeedNumberSignal = computed(() => {
    return seedrandom(this.seedSignal());
  });

  randomNumberSignal = computed(() => {
    return Math.floor(this.randomSeedNumberSignal()() * this.countriesService.countriesSignal.length);
  });

  countrySignal = toSignal(
    combineLatest([toObservable(this.countriesService.countriesSignal), toObservable(this.randomNumberSignal)]).pipe(
      filter((val) => val[0].length > 0),
      map((val) => val[0][val[1]]),
      shareReplay({ refCount: false, bufferSize: 1 })
    )
  );

  isGuessed$ = combineLatest([
    this.guesses$.pipe(map((guesses) => guesses.map((guess) => guess.name))),
    toObservable(this.countrySignal)
  ]).pipe(
    filter((val): val is [string[], Country] => {
      return Boolean(val[0]) && Boolean(val[1]);
    }),
    map(([guesses, country]) => guesses.includes(country.name)),
    shareReplay({ refCount: false, bufferSize: 1 })
  );

  isOverAllowedAttemptsSignal = computed(() => {
    return this.guessesSignal().length >= 5;
  });

  isEndedSignal = computed(() => {
    return this.isGuessedSignal() || this.isOverAllowedAttemptsSignal();
  });

  successesSignal = computed(() => {
    if (this.isEndedSignal()) {
      return getStatisticsCount(STAT_GUESSES_SUCCESS_STORAGE_KEY.replace(KEY_INTERPOLATION, this.typeSignal()));
    } else {
      return 0;
    }
  });

  failuresSignal = computed(() => {
    if (this.isEndedSignal()) {
      return getStatisticsCount(STAT_GUESSES_FAILURE_STORAGE_KEY.replace(KEY_INTERPOLATION, this.typeSignal()));
    } else {
      return 0;
    }
  });

  guessesSignal = toSignal(this.guesses$, { initialValue: [] as Country[] });
  isGuessedSignal = toSignal(this.isGuessed$, { initialValue: false });

  constructor() {
    this.onGuessChange();
    this.updateStatistics();

    deletePreviousSavedGuesses(this.transformDate(new Date()));
  }

  private updateStatistics() {
    effect(() => {
      if (this.isGuessedSignal()) {
        untracked(() => {
          saveStatistics(
            this.isGuessedSignal(),
            this.typeSignal(),
            STAT_GUESSES_SUCCESS_STORAGE_KEY.replace(KEY_INTERPOLATION, this.typeSignal()),
            this.transformDate(new Date())
          );
        });
      }
    });

    effect(() => {
      if (this.isOverAllowedAttemptsSignal()) {
        untracked(() => {
          saveStatistics(
            this.isOverAllowedAttemptsSignal(),
            this.typeSignal(),
            STAT_GUESSES_FAILURE_STORAGE_KEY.replace(KEY_INTERPOLATION, this.typeSignal()),
            this.transformDate(new Date())
          );
        });
      }
    });
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
    effect(() => {
      localStorage.setItem(
        this.getKey(this.seedSignal()),
        JSON.stringify(this.guessesSignal().map((guess) => guess.isoCode))
      );
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
    if (key?.includes(GAME_GUESSES_START_STORAGE_KEY)) {
      keys.push(key);
    }
  }
  const gameKeys = keys.filter((key) => key.indexOf(seed) === -1);
  for (const item of gameKeys) {
    localStorage.removeItem(item);
  }
}

export function saveStatistics(shouldSave: boolean, type: PlayType, key: string, today: string) {
  if (shouldSave) {
    const savedIsGuessed: string[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    savedIsGuessed.push(today);
    localStorage.setItem(key, JSON.stringify([...new Set(savedIsGuessed)]));
  }
}

export function getStatisticsCount(key: string): number {
  return JSON.parse(localStorage.getItem(key) ?? '[]').length;
}
