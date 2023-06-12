import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Meta } from '@angular/platform-browser';

const THEME_STORAGE_KEY = 'THEME::selected';
const LANGUAGE_STORAGE_KEY = 'LANGUAGE::selected';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  meta = inject(Meta);

  langSignal: WritableSignal<string>;
  themeSignal: WritableSignal<Theme>;

  constructor(private translocoService: TranslocoService) {
    this.langSignal = signal(localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? this.determineSystemLanguage());

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    this.themeSignal = signal((localStorage.getItem(THEME_STORAGE_KEY) as Theme) ?? systemTheme);

    effect(() => {
      this.translocoService.setActiveLang(this.langSignal());
      localStorage.setItem(LANGUAGE_STORAGE_KEY, this.langSignal());
    });

    effect(() => {
      if (this.themeSignal() === 'light') {
        document.body.classList.remove('dark');

        this.meta.updateTag(
          {
            content: '#fafafa'
          },
          'name=theme-color'
        );
      } else {
        this.meta.updateTag(
          {
            content: '#303030'
          },
          'name=theme-color'
        );
        document.body.classList.add('dark');
      }
      localStorage.setItem(THEME_STORAGE_KEY, this.themeSignal());
    });
  }

  private determineSystemLanguage() {
    let systemLang = this.translocoService.getDefaultLang();
    if (/^bg\b/.test(navigator.language)) {
      systemLang = 'bg';
    }
    if (/^en\b/.test(navigator.language)) {
      systemLang = 'en';
    }
    if (/^nl\b/.test(navigator.language)) {
      systemLang = 'nl';
    }
    return systemLang;
  }
}
