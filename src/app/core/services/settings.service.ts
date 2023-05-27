import { computed, effect, inject, Injectable, signal } from '@angular/core';
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

  private state = signal({
    theme:
      (localStorage.getItem(THEME_STORAGE_KEY) as Theme) ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    lang: localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? this.translocoService.getDefaultLang()
  });

  readonly theme = computed(() => this.state().theme);
  readonly lang = computed(() => this.state().lang);

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
}
