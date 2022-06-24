import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LangDefinition, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-language-selection',
  template: `
    <mat-form-field>
      <mat-label>{{ 'language' | transloco }}</mat-label>
      <mat-select [value]="activeLang" (valueChange)="updateActiveLang($event)">
        <mat-option *ngFor="let lang of langs" [value]="lang.id">{{
          lang.label
        }}</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectionComponent {
  langs: LangDefinition[] = this.translocoService
    .getAvailableLangs()
    .map((lang) => {
      if (typeof lang === 'string') {
        return { id: lang, label: lang };
      }
      return lang;
    });
  activeLang = this.translocoService.getActiveLang();

  constructor(private translocoService: TranslocoService) {}

  updateActiveLang($event: string) {
    this.translocoService.setActiveLang($event);
  }
}
