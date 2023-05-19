import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { environment } from '../environments/environment';

export function getAllLangs(translocoService: TranslocoService) {
  const langs: string[] = [];
  translocoService.getAvailableLangs().forEach((val) => {
    if (typeof val === 'string') {
      langs.push(val);
    } else {
      langs.push(val.id);
    }
  });
  return langs;
}

export function getAllLanguageLoads$(translocoService: TranslocoService) {
  const langs = getAllLangs(translocoService);
  return langs.map((lang) => translocoService.load(lang));
}

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: [
          { id: 'en', label: 'english' },
          { id: 'bg', label: 'български' }
        ],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  ]
})
export class TranslocoRootModule {}
