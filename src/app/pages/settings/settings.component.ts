import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  template: `
    <mat-card>
      <mat-card-title class="text-center">{{
        'guessy' | transloco
      }}</mat-card-title>
      <mat-card-subtitle class="text-center">{{
        'settings' | transloco
      }}</mat-card-subtitle>
      <mat-card-content class="flex flex-col justify-center">
        <div class="flex flex-col gap-2">
          <app-language-selection></app-language-selection>
          <app-theme-selection></app-theme-selection>
        </div>
      </mat-card-content>
      <mat-card-actions [align]="'end'">
        <button [routerLink]="['/home']" mat-button mat-raised-button>
          {{ 'back' | transloco }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {}
