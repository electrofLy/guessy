import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlayService } from './play.service';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { CountryFormComponent } from './country-form/country-form.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { EndComponent } from './end/end.component';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-play',
  template: `
    <mat-card class="max-w-xs">
      <mat-card-header class="justify-center">
        <mat-card-title class="text-center">{{ 'guessy' | transloco }}</mat-card-title>
        <mat-card-subtitle class="text-center">{{ 'play' | transloco }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content class="!flex flex-col justify-center text-justify">
        @if (!playService.isEnded()) {
        <app-country-form />
        } @else {
        <app-end class="!flex flex-col justify-center" />
        }
      </mat-card-content>
      <mat-card-actions [align]="'end'">
        <div class="flex flex-col">
          <span data-test="stat-success"> ✅ - {{ playService.successes() }} </span>
          <span data-test="stat-fail"> ❌ - {{ playService.failures() }} </span>
        </div>
        <div class="flex-grow"></div>
        <button [routerLink]="['/home']" mat-button mat-raised-button>
          {{ 'back' | transloco }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    CountryFormComponent,
    MatButtonModule,
    RouterLink,
    TranslocoModule,
    CommonModule,
    TranslocoModule,
    MatCardModule,
    MatButtonModule,
    NgOptimizedImage,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatListModule,
    CountryFormComponent,
    EndComponent,
    MatBadgeModule
  ],
  providers: [PlayService, DatePipe]
})
export class PlayComponent {
  playService = inject(PlayService);
}
