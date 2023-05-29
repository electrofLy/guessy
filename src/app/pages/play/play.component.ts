import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { PlayService } from './play.service';

@Component({
  selector: 'app-play',
  template: ` <mat-card class="max-w-xs">
    <mat-card-title class="text-center">{{ 'guessy' | transloco }}</mat-card-title>
    <mat-card-subtitle class="text-center">{{ 'play' | transloco }}</mat-card-subtitle>
    <mat-card-content class="!flex flex-col justify-center text-justify">
      <ng-container *ngIf="!playService.isEnded(); else end">
        <app-country-form />
      </ng-container>
      <ng-template #end>
        <app-end class="!flex flex-col justify-center" />
      </ng-template>
    </mat-card-content>
    <mat-card-actions [align]="'end'">
      <button [routerLink]="['/home']" mat-button mat-raised-button>
        {{ 'back' | transloco }}
      </button>
    </mat-card-actions>
  </mat-card>`,
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
    PlayComponent,
    CountryFormComponent,
    EndComponent
  ],
  providers: [PlayService, DatePipe]
})
export class PlayComponent {
  playService = inject(PlayService);
}
