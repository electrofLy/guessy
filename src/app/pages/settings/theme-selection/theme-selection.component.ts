import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, takeUntil } from 'rxjs';

export interface ThemeDefinition {
  id: string;
  label: string;
}

@Component({
  selector: 'app-theme-selection',
  template: `
    <mat-form-field>
      <mat-label>{{ 'theme' | transloco }}</mat-label>
      <mat-select [value]="theme$ | async" (valueChange)="theme$.next($event)">
        <mat-option
          *ngFor="let theme of themeOptions$ | async"
          [value]="theme.id"
          >{{ theme.label | transloco }}</mat-option
        >
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSelectionComponent implements OnDestroy {
  theme$ = new BehaviorSubject('light');
  themeOptions$: Observable<ThemeDefinition[]> = of([
    { id: 'dark', label: 'dark' },
    { id: 'light', label: 'light' }
  ]);
  destroyer$ = new Subject<void>();

  constructor() {
    this.theme$.pipe(takeUntil(this.destroyer$)).subscribe((theme) => {
      if (theme === 'light') {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      } else {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}
