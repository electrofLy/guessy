import { inject, Injectable } from '@angular/core';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs';
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

export function extractCountryName(countries: CountryJson[], lang: string) {
  return countries.map<Country>((val) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { names, ...countryFields } = val;
    return { name: val.names[lang], ...countryFields };
  });
}

@Injectable({ providedIn: 'root' })
export class CountriesService {
  http = inject(HttpClient);
  activeLang$ = inject(TranslocoService).langChanges$.pipe(distinctUntilChanged());

  countries$ = this.activeLang$.pipe(
    switchMap((lang) =>
      this.http
        .get<CountryJson[]>('/assets/countries.json')
        .pipe(map((countries) => extractCountryName(countries, lang)))
    ),
    shareReplay({
      refCount: false,
      bufferSize: 1
    })
  );
}
