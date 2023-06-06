import { DestroyRef, inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';

const THEME_STORAGE_KEY = 'THEME::selected';
const LANGUAGE_STORAGE_KEY = 'LANGUAGE::selected';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  theme$ = new ReplaySubject<Theme>(1);
  lang$ = new ReplaySubject<string>(1);
  destroyRef = inject(DestroyRef);
  meta = inject(Meta);

  constructor(private translocoService: TranslocoService) {
    this.onThemeChange();
    this.onLangChange();
  }

  private onLangChange() {
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

    this.lang$.next(localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? systemLang);
    this.lang$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.translocoService.setActiveLang(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    });
  }

  private onThemeChange() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.theme$.next((localStorage.getItem(THEME_STORAGE_KEY) as Theme) ?? systemTheme);
    this.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((theme) => {
      if (theme === 'light') {
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
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    });
  }
}
