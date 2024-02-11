import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsService } from '../../../core/services/settings.service';
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
      <mat-select [value]="settingsService.theme()" (valueChange)="settingsService.theme.set($event)">
        @for (theme of themeOptions; track theme) {
        <mat-option [value]="theme.id">{{ theme.label | transloco }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, AsyncPipe, TranslocoModule]
})
export class ThemeSelectionComponent {
  settingsService: SettingsService = inject(SettingsService);

  themeOptions: ThemeDefinition[] = [
    { id: 'light', label: 'light' },
    { id: 'dark', label: 'dark' }
  ];
}
