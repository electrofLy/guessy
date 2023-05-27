import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Meta } from '@angular/platform-browser';
import equal from 'fast-deep-equal';

const THEME_STORAGE_KEY = 'THEME::selected';
const LANGUAGE_STORAGE_KEY = 'LANGUAGE::selected';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  meta = inject(Meta);
  private state = signal({
    theme: this.getDefaultTheme(),
    lang: this.getDefaultLang()
  });
  readonly theme = computed(() => this.state().theme, { equal });
  readonly lang = computed(() => this.state().lang, { equal });
  private onLangChange = effect(() => {
    this.translocoService.setActiveLang(this.lang());
    localStorage.setItem(LANGUAGE_STORAGE_KEY, this.lang());
  });
  private onThemeChange = effect(() => {
    if (this.theme() === 'light') {
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
    localStorage.setItem(THEME_STORAGE_KEY, this.theme());
  });

  constructor(private translocoService: TranslocoService) {}

  updateTheme(theme: Theme) {
    this.state.update((state) => ({
      ...state,
      theme
    }));
  }

  updateLang(lang: string) {
    this.state.update((state) => ({
      ...state,
      lang
    }));
  }

  private getDefaultTheme() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) ?? systemTheme;
  }

  private getDefaultLang() {
    let systemLang = this.translocoService.getDefaultLang();
    if (/^bg\b/.test(navigator.language)) {
      systemLang = 'bg';
    }
    if (/^en\b/.test(navigator.language)) {
      systemLang = 'en';
    }
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? systemLang;
  }
}
