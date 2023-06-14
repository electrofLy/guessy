import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { interval, map, startWith, tap } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PlayService } from '../play.service';
import { SettingsService } from '../../../core/services/settings.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-end',
  template: ` <ng-container>
    <img
      class="self-center mb-4"
      *ngIf="playService.countrySignal() as country"
      [ngClass]="{ invert: settingsService.themeSignal() === 'dark' && playService.typeSignal() === 'SHAPE' }"
      [ngSrc]="playService.typeSignal() === 'SHAPE' ? country.shapeUrl : country.flagUrl"
      [height]="playService.typeSignal() === 'SHAPE' ? 200 : 150"
      priority="true"
      width="200"
      alt="country-flag-am"
    />
    <p class="text-justify" *ngIf="playService.countrySignal() as country">
      <ng-container *ngIf="playService.isGuessedSignal() === true; else failed">
        <span data-test="success-guess">{{ 'endSuccess' | transloco : [country.name] }}</span>
      </ng-container>
      <ng-template #failed>
        <span data-test="fail-guess">{{ 'endFailed' | transloco : [country.name] }}</span>
      </ng-template>
    </p>
    <p class="text-justify">
      {{ 'endDetails' | transloco : [countdownSignal()] }}
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

  today = new Date();
  countdownSignal = toSignal(
    interval(1000).pipe(
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
    )
  );
}
