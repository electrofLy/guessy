import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';
import { LanguageSelectionComponent } from './language-selection/language-selection.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-settings',
  template: `
    <mat-card>
      <mat-card-title class="text-center">{{ 'guessy' | transloco }}</mat-card-title>
      <mat-card-subtitle class="text-center">{{ 'settings' | transloco }}</mat-card-subtitle>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    TranslocoModule,
    MatFormFieldModule,
    MatSelectModule,
    SettingsComponent,
    LanguageSelectionComponent,
    ThemeSelectionComponent,
    MatCardModule,
    LanguageSelectionComponent,
    ThemeSelectionComponent,
    MatButtonModule,
    RouterLink,
    TranslocoModule
  ]
})
export class SettingsComponent {}
