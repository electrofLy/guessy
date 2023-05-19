import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { PlayService, PlayType } from './play.service';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { CountryFormComponent } from './country-form/country-form.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { combineLatest } from 'rxjs';
import { EndComponent } from './end/end.component';

@Component({
  selector: 'app-play',
  template: ` <mat-card *ngIf="view$ | async as view">
    <mat-card-title class="text-center">{{ 'guessy' | transloco }}</mat-card-title>
    <mat-card-subtitle class="text-center">{{ 'play' | transloco }}</mat-card-subtitle>
    <mat-card-content class="!flex flex-col justify-center max-w-s text-justify">
      <ng-container *ngIf="view.isEnded === false; else end">
        <app-country-form />
      </ng-container>
      <ng-template #end> <app-end class="!flex flex-col justify-center" /> </ng-template>
    </mat-card-content>
    <mat-card-actions [align]="'end'">
      <button [routerLink]="['/home']" mat-button mat-raised-button>
        {{ 'back' | transloco }}
      </button>
    </mat-card-actions>
  </mat-card>`,
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
    PlayComponent,
    CountryFormComponent,
    EndComponent
  ],
  providers: [PlayService]
})
export class PlayComponent {
  playService = inject(PlayService);
  router = inject(Router);
  view$ = combineLatest({
    isEnded: this.playService.isEnded$
  });

  @Input() set type(val: PlayType) {
    this.playService.type$.next(val);
  }
}
