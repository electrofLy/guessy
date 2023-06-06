import { TranslocoTestingModule } from '@ngneat/transloco';
import bg from '../assets/i18n/bg.json';
import en from '../assets/i18n/en.json';
import nl from '../assets/i18n/nl.json';

export function createTranslocoTestingModule() {
  return TranslocoTestingModule.forRoot({
    translocoConfig: {
      defaultLang: 'en',
      availableLangs: [
        { id: 'en', label: 'english' },
        { id: 'bg', label: 'български' },
        { id: 'nl', label: 'nederlands' }
      ],
      reRenderOnLangChange: true
    },
    langs: { bg, en, nl }
  });
}
