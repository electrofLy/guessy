import { computed, inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

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
  settingsService = inject(SettingsService);

  private countries$ = toObservable(this.settingsService.langSignal).pipe(
    switchMap((lang) => {
      return this.http.get<CountryJson[]>('/assets/countries.json').pipe(
        map((countries) => {
          return extractCountryName(countries, lang);
        })
      );
    })
  );

  countriesSignal = toSignal(this.countries$, { initialValue: [] });

  countryNamesSignal = computed(() => {
    return this.countriesSignal().map((country) => country.name);
  });
}
