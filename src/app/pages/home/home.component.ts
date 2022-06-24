import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  template: ` <mat-card>
    <mat-card-title class="text-center">{{
      'guessy' | transloco
    }}</mat-card-title>
    <mat-card-content class="flex flex-col justify-center">
      <div class="flex flex-col gap-2">
        <button mat-button mat-raised-button color="primary">
          {{ 'play' | transloco }}
        </button>
        <button mat-button mat-raised-button color="primary">
          {{ 'rooms' | transloco }}
        </button>
        <button
          [routerLink]="['/settings']"
          mat-button
          mat-raised-button
          color="primary"
        >
          {{ 'settings' | transloco }}
        </button>
        <button mat-button mat-raised-button color="primary">
          {{ 'info' | transloco }}
        </button>
      </div>
    </mat-card-content>
  </mat-card>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
