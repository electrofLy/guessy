import { HttpClient } from '@angular/common/http';
import { provideTransloco, Translation, TranslocoLoader, TranslocoModule, TranslocoService } from '@ngneat/transloco';
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
    provideTransloco({
      config: {
        availableLangs: [
          { id: 'en', label: 'english' },
          { id: 'bg', label: 'български' },
          { id: 'nl', label: 'nederlands' }
        ],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production
      },
      loader: TranslocoHttpLoader
    })
  ]
})
export class TranslocoRootModule {}
