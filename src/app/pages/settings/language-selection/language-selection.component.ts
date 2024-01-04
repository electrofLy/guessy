import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangDefinition, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { getAllLangs } from '../../../transloco-root.module';
import { SettingsService } from '../../../core/services/settings.service';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-language-selection',
  template: `
    <mat-form-field data-test="language-selection">
      <mat-label>{{ 'language' | transloco }}</mat-label>
      <mat-select [value]="settingsService.lang()" (valueChange)="settingsService.lang.set($event)">
        @for (lang of langs; track lang) {
        <mat-option [value]="lang.id">{{ lang.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatOptionModule, AsyncPipe, TranslocoModule]
})
export class LanguageSelectionComponent {
  private translocoService: TranslocoService = inject(TranslocoService);
  langs: LangDefinition[] = getAllLangs(this.translocoService).map((lang) => ({
    id: lang,
    label: lang
  }));
  settingsService: SettingsService = inject(SettingsService);

  constructor() {}
}
