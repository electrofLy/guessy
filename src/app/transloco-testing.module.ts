import { provideTransloco, Translation, TranslocoLoader } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import bg from '../assets/i18n/bg.json';
import en from '../assets/i18n/en.json';
import nl from '../assets/i18n/nl.json';
import { of } from 'rxjs';

const langs: Record<string, Translation> = {
  en,
  bg,
  nl
};

@Injectable({ providedIn: 'root' })
export class TranslocoTestingHttpLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return of(langs[lang] || {});
  }
}

export function createTranslocoTestingModule() {
  return provideTransloco({
    config: {
      defaultLang: 'en',
      availableLangs: [
        { id: 'en', label: 'english' },
        { id: 'bg', label: 'български' },
        { id: 'nl', label: 'nederlands' }
      ],
      reRenderOnLangChange: true
    },
    loader: TranslocoTestingHttpLoader
  });
}
