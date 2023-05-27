import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsService, Theme } from '../../../core/services/settings.service';
import { TranslocoModule } from '@ngneat/transloco';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface ThemeDefinition {
  id: string;
  label: string;
}

@Component({
  selector: 'app-theme-selection',
  template: `
    <mat-form-field data-test="theme-selection">
      <mat-label>{{ 'theme' | transloco }}</mat-label>
      <mat-select [value]="theme" (valueChange)="updateTheme($event)">
        <mat-option *ngFor="let theme of themeOptions" [value]="theme.id">{{ theme.label | transloco }}</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, AsyncPipe, TranslocoModule]
})
export class ThemeSelectionComponent {
  theme = this.settingsService.theme();
  themeOptions: ThemeDefinition[] = [
    { id: 'light', label: 'light' },
    { id: 'dark', label: 'dark' }
  ];

  constructor(private settingsService: SettingsService) {}

  updateTheme($event: Theme) {
    this.settingsService.updateTheme($event);
  }
}
