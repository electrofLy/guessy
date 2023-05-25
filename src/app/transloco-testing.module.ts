import { TranslocoTestingModule } from '@ngneat/transloco';
import bg from '../assets/i18n/bg.json';
import en from '../assets/i18n/en.json';

export function createTranslocoTestingModule() {
  return TranslocoTestingModule.forRoot({
    translocoConfig: {
      availableLangs: [
        { id: 'en', label: 'english' },
        { id: 'bg', label: 'български' }
      ],
      reRenderOnLangChange: true
    },
    langs: { bg, en }
  });
}
