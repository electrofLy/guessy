import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, map, startWith, take } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { AsyncPipe, NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { convertDistance, getCompassDirection, getDistance } from 'geolib';
import { CountriesService, Country } from '../../../core/services/countries.service';
import { PlayService } from '../play.service';
import { SettingsService } from '../../../core/services/settings.service';

const DIRECTION_MAT_ICONS = {
  S: 'south',
  W: 'west',
  NNE: 'north_east',
  NE: 'north_east',
  ENE: 'north_east',
  E: 'east',
  ESE: 'south_east',
  SE: 'south_east',
  SSE: 'south_east',
  SSW: 'south_west',
  SW: 'south_west',
  WSW: 'south_west',
  WNW: 'north_west',
  NW: 'north_west',
  NNW: 'north_west',
  N: 'north'
};

export function getCountryName(country: string | Country) {
  const val = country;
  return typeof val === 'string' ? val : val.name;
}

export function countryExists(country: string | Country, countryNames: string[]) {
  const val = getCountryName(country);
  return countryNames.find((name) => name.toLowerCase() === val.toLowerCase()) ? {} : { invalidCountry: val };
}

export function filterCountries(countries: Country[], country: string | Country) {
  const val = getCountryName(country);

  return countries.filter((option) => option.name.toLowerCase().includes(val.toLowerCase()));
}

export interface Guess {
  name: string;
  icon: string;
  distance: number;
}

export function createGuesses(guesses: Country[], country: Country): Guess[] {
  return guesses.map((guess) => {
    const origin = {
      latitude: guess.coordinates.lat,
      longitude: guess.coordinates.lng
    };
    const dest = {
      latitude: country.coordinates.lat,
      longitude: country.coordinates.lng
    };
    return {
      name: guess.name,
      icon: DIRECTION_MAT_ICONS[getCompassDirection(origin, dest)],
      distance: Math.floor(convertDistance(getDistance(origin, dest), 'km'))
    };
  });
}

@Component({
  selector: 'app-country-form',
  template: `
    @if (view$ | async; as view) {
    <form
      class="flex flex-col justify-center items-center gap-2"
      [formGroup]="form"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    >
      @for (country of [view.country]; track country) {
      <img
        [ngClass]="{ invert: settingsService.theme() === 'dark' && view.type === 'SHAPE' }"
        [ngSrc]="view.type === 'SHAPE' ? country.shapeUrl : country.flagUrl"
        [height]="view.type === 'SHAPE' ? 200 : 150"
        priority="true"
        width="200"
        alt="country-flag-am"
      />
      }

      <mat-list class="w-full">
        @for (guess of view.guesses; track guess; let i = $index) {
        <mat-list-item data-test="guess-list-item">
          <mat-icon class="!self-center !mt-0" matListItemIcon>{{ guess.icon }}</mat-icon>
          <h3 matListItemTitle>{{ guess.name }}</h3>
          <p matListItemLine>
            <span>{{ guess.distance }} KM</span>
          </p>
        </mat-list-item>
        }
      </mat-list>
      <mat-form-field data-test="country-input">
        <mat-label>{{ 'guessCountry' | transloco }}</mat-label>
        <!-- hack using search in the name field so autofill is not displayed in Safari-->
        <input
          #countryInput
          [matAutocomplete]="auto"
          name="notASearchField"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          role="presentation"
          aria-autocomplete="none"
          type="text"
          matInput
          formControlName="country"
        />
        <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
          @for (country of view.countries; track country) {
          <mat-option [value]="country"> {{ country.name }}</mat-option>
          }
        </mat-autocomplete>
        <button
          [disabled]="!form.valid"
          (click)="onSubmit($event, form.value.country!, view.countries)"
          data-test="submit-guess"
          color="primary"
          mat-icon-button
          matSuffix
        >
          <mat-icon>send</mat-icon>
        </button>
        @if (form.controls.country.errors?.['required']) {
        <mat-error>{{ 'required' | transloco }}</mat-error>
        } @if (form.controls.country.errors?.['invalidCountry']) {
        <mat-error>{{ 'invalidCountry' | transloco }}</mat-error>
        }
      </mat-form-field>
    </form>
    }
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatListModule,
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    TranslocoModule,
    NgClass
  ]
})
export class CountryFormComponent {
  router = inject(Router);
  playService = inject(PlayService);
  countriesService = inject(CountriesService);
  settingsService = inject(SettingsService);
  form = new FormGroup({
    country: new FormControl<Country | string>('', {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [
        (control) =>
          this.countriesService.countryNames$.pipe(
            map((val) => countryExists(control.value, val)),
            take(1)
          )
      ]
    })
  });
  filteredCountries$ = combineLatest([
    this.countriesService.countries$,
    this.form.controls.country.valueChanges.pipe(startWith(''))
  ]).pipe(map((val) => filterCountries(val[0], val[1])));
  guessesWithDistance$ = combineLatest([this.playService.guesses$, this.playService.country$]).pipe(
    map(([guesses, country]) => {
      return createGuesses(guesses, country);
    })
  );
  view$ = combineLatest({
    country: this.playService.country$,
    countries: this.filteredCountries$,
    guesses: this.guessesWithDistance$,
    type: this.playService.type$
  });

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;

  displayFn(country: Country) {
    return country?.name ?? '';
  }

  onSubmit(event: Event, country: Country | string, countries: Country[]) {
    if (typeof country !== 'string') {
      this.playService.guess$.next(country);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.playService.guess$.next(countries.find((val) => val.name.toLowerCase() === country.toLowerCase())!);
    }
    this.form.controls.country.setValue('');
    setTimeout(() => {
      // close the autocomplete after submission for better user experience
      this.autocompleteTrigger.closePanel();
    });
  }
}
