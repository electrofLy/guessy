import { APP_INITIALIZER, enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { getAllLanguageLoads$, TranslocoRootModule } from './app/transloco-root.module';
import { combineLatest, take } from 'rxjs';
import { SettingsService } from './app/core/services/settings.service';
import { TranslocoService } from '@ngneat/transloco';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideRouter, Routes, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { MAT_CARD_CONFIG } from '@angular/material/card';

if (environment.production) {
  enableProdMode();
}

const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./app/pages/home/home.component').then((m) => m.HomeComponent)
  },

  {
    path: 'flag',
    loadComponent: () => import('./app/pages/play/play.component').then((m) => m.PlayComponent),
    data: {
      type: 'FLAG'
    }
  },
  {
    path: 'shape',
    loadComponent: () => import('./app/pages/play/play.component').then((m) => m.PlayComponent),
    data: {
      type: 'SHAPE'
    }
  },
  {
    path: 'settings',
    loadComponent: () => import('./app/pages/settings/settings.component').then((m) => m.SettingsComponent)
  },
  {
    path: 'information',

    loadComponent: () => import('./app/pages/information/information.component').then((m) => m.InformationComponent)
  },
  { path: '**', redirectTo: 'home' }
];

export function initializeApp(translocoService: TranslocoService, settingsService: SettingsService) {
  return () =>
    combineLatest([...getAllLanguageLoads$(translocoService), settingsService.lang$, settingsService.theme$]).pipe(
      take(1)
    );
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, TranslocoRootModule),
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' }
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: { appearance: 'outlined' }
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeApp,
      deps: [TranslocoService, SettingsService]
    },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
})
  // eslint-disable-next-line no-undef
  .catch((err) => console.error(err));
