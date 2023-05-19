import { inject, Injectable } from '@angular/core';
import { map, shareReplay, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslocoService } from '@ngneat/transloco';

export interface CountryJson {
  isoCode: string;
  names: Record<string, string>;
  flagUrl: string;
  shapeUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Country extends Omit<CountryJson, 'names'> {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CountriesService {
  http = inject(HttpClient);
  activeLang$ = inject(TranslocoService).langChanges$;

  countries$ = this.activeLang$.pipe(
    switchMap((lang) => {
      return this.http.get<CountryJson[]>('/assets/countries.json').pipe(
        map((countries) => {
          return countries.map<Country>((val) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { names, ...countryFields } = val;
            return { name: val.names[lang], ...countryFields };
          });
        })
      );
    }),
    shareReplay({
      refCount: false,
      bufferSize: 1
    })
  );
  countryNames$ = this.countries$.pipe(
    map((val) => val.map((country) => country.name)),
    shareReplay({ refCount: false, bufferSize: 1 })
  );
}
