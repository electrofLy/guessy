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
  template: ` @if (view$ | async; as view) { @for (country of [playService.country()]; track country) {
    <img
      class="self-center mb-4"
      [ngClass]="{ invert: settingsService.theme() === 'dark' && playService.type === 'SHAPE' }"
      [ngSrc]="playService.type === 'SHAPE' ? country.shapeUrl : country.flagUrl"
      [height]="playService.type === 'SHAPE' ? 200 : 150"
      priority="true"
      width="200"
      alt="country-flag-am"
    />
    }
    <p class="text-justify">
      @if (playService.isGuessed()) {
      <span data-test="success-guess">{{ 'endSuccess' | transloco: [playService.country().name] }}</span>
      } @else {
      <span data-test="fail-guess">{{ 'endFailed' | transloco: [playService.country().name] }}</span>
      }
    </p>
    <p class="text-justify">
      {{ 'endDetails' | transloco: [view.countdown] }}
    </p>

    }`,
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
    NgOptimizedImage
  ]
})
export class EndComponent {
  playService = inject(PlayService);
  settingsService = inject(SettingsService);
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
    countdown: this.countdown$
  });
}
