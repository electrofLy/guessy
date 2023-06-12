import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, interval, map, startWith, tap } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PlayService } from '../play.service';
import { SettingsService } from '../../../core/services/settings.service';

@Component({
  selector: 'app-end',
  template: ` <ng-container *ngIf="view$ | async as view">
    <img
      class="self-center mb-4"
      *ngFor="let country of [view.country]"
      [ngClass]="{ invert: settingsService.themeSignal() === 'dark' && view.type === 'SHAPE' }"
      [ngSrc]="view.type === 'SHAPE' ? country.shapeUrl : country.flagUrl"
      [height]="view.type === 'SHAPE' ? 200 : 150"
      priority="true"
      width="200"
      alt="country-flag-am"
    />
    <p class="text-justify">
      <ng-container *ngIf="view.isGuessed === true; else failed">
        <span data-test="success-guess">{{ 'endSuccess' | transloco : [view.country.name] }}</span>
      </ng-container>
      <ng-template #failed>
        <span data-test="fail-guess">{{ 'endFailed' | transloco : [view.country.name] }}</span>
      </ng-template>
    </p>
    <p class="text-justify">
      {{ 'endDetails' | transloco : [view.countdown] }}
    </p>
  </ng-container>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    NgOptimizedImage,
    AsyncPipe,
    TranslocoModule,
    CommonModule,
    MatButtonModule,
    TranslocoModule,
    NgOptimizedImage,
    EndComponent
  ]
})
export class EndComponent {
  playService = inject(PlayService);
  settingsService = inject(SettingsService);
  isGuessed$ = this.playService.isGuessed$;
  country$ = this.playService.country$;
  today = new Date();
  countdown$ = interval(1000).pipe(
    startWith(0),
    map(() => {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        new Date(
          this.today.getFullYear(),
          this.today.getMonth(),
          this.today.getDate() + 1
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
        ) - new Date()
      );
    }),
    tap((remainingTime) => {
      if (remainingTime <= 0) {
        location.reload();
      }
    }),
    map((remainingTime) => {
      // Convert remaining time to hours, minutes, and seconds
      const hours = Math.floor(remainingTime / (1000 * 60 * 60))
        .toString()
        .padStart(2, '0');
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, '0');
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, '0');

      // Display the remaining time
      return `${hours}:${minutes}:${seconds}`;
    })
  );

  view$ = combineLatest({
    isGuessed: this.isGuessed$,
    country: this.country$,
    countdown: this.countdown$,
    type: this.playService.type$
  });
}
