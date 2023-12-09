import { ChangeDetectionStrategy, Component } from '@angular/core';
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
      <mat-select [value]="lang$ | async" (valueChange)="lang$.next($event)">
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
  langs: LangDefinition[] = getAllLangs(this.translocoService).map((lang) => ({
    id: lang,
    label: lang
  }));
  lang$ = this.settingsService.lang$;

  constructor(
    private translocoService: TranslocoService,
    private settingsService: SettingsService
  ) {}
}
