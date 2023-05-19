import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, map, startWith, take } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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

@Component({
  selector: 'app-country-form',
  template: `
    <form
      class="flex flex-col justify-center items-center gap-2"
      *ngIf="view$ | async as view"
      [formGroup]="form"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    >
      <img
        [ngClass]="{ invert: view.theme === 'dark' && view.type === 'SHAPE' }"
        [ngSrc]="view.type === 'SHAPE' ? view.country.shapeUrl : view.country.flagUrl"
        [height]="view.type === 'SHAPE' ? 200 : 150"
        priority="true"
        width="200"
        alt="country-flag-am"
      />

      <mat-list>
        <mat-list-item *ngFor="let guess of view.guesses; let i = index">
          <div class="!flex items-center">
            {{ i + 1 }}. {{ guess.name }} (<mat-icon class="mr-2" [inline]="true" color="primary">{{
              guess.icon
            }}</mat-icon>
            {{ guess.distance }} KM)
          </div>
        </mat-list-item>
      </mat-list>
      <mat-form-field>
        <mat-label>{{ 'guessCountry' | transloco }}</mat-label>
        <!-- hack using search in the name field so autofill is not displayed in Safari-->
        <input
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
          <mat-option *ngFor="let country of view.countries" [value]="country"> {{ country.name }}</mat-option>
        </mat-autocomplete>
        <button
          [disabled]="!form.valid"
          (click)="onSubmit($event, form.value.country!)"
          color="primary"
          mat-icon-button
          matSuffix
        >
          <mat-icon>send</mat-icon>
        </button>
        <mat-error *ngIf="form.controls.country.errors?.['required']">{{ 'required' | transloco }}</mat-error>
        <mat-error *ngIf="form.controls.country.errors?.['invalidCountry']">{{
          'invalidCountry' | transloco
        }}</mat-error>
      </mat-form-field>
    </form>
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
  settings = inject(SettingsService);
  form = new FormGroup({
    country: new FormControl<Country | string>('', {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [
        (control) =>
          this.countriesService.countryNames$.pipe(
            map((val) => {
              const controlValue = this.getControlValue(control.value);
              return val.includes(controlValue) ? {} : { invalidCountry: control.value };
            }),
            take(1)
          )
      ]
    })
  });
  filteredCountries$ = combineLatest([
    this.countriesService.countries$,
    this.form.controls.country.valueChanges.pipe(startWith(''))
  ]).pipe(
    map((val) => {
      const filterValue = this.getControlValue(val[1]).toLowerCase();

      return val[0].filter((option) => option.name.toLowerCase().includes(filterValue));
    })
  );
  guessesWithDistance$ = combineLatest([this.playService.guesses$, this.playService.country$]).pipe(
    map(([guesses, country]) => {
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
    })
  );
  view$ = combineLatest({
    country: this.playService.country$,
    countries: this.filteredCountries$,
    guesses: this.guessesWithDistance$,
    type: this.playService.type$,
    theme: this.settings.theme$
  });

  getControlValue(country: Country | string) {
    const input = country;
    return typeof input === 'string' ? input : input.name;
  }

  displayFn(country: Country) {
    return country?.name ?? '';
  }

  onSubmit(event: Event, country: Country | string) {
    event.stopPropagation();
    if (typeof country !== 'string') {
      this.playService.guess$.next(country);
      this.form.controls.country.setValue('');
    }
  }
}