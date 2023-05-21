import { RouterTestingModule } from '@angular/router/testing';
import { SettingsComponent } from './settings.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('SettingsComponent', () => {
  beforeEach(() => {
    cy.mount(SettingsComponent, {
      imports: [
        SettingsComponent,
        RouterTestingModule,
        TranslocoTestingModule.forRoot({
          translocoConfig: {
            availableLangs: [
              { id: 'en', label: 'english' },
              { id: 'bg', label: 'български' }
            ],
            reRenderOnLangChange: true
          },
          langs: { en: { settings: 'test1' }, bg: { settings: 'test2' } }
        }),
        NoopAnimationsModule
      ]
    });
  });
  it('should be able to change language', () => {
    cy.get(`[data-test="settings-subtitle"]`).should('contain.text', 'test1');
    cy.get(`[data-test="language-selection"]`).click();
    cy.get(`mat-option`).should('contain.text', 'en');
    cy.get(`mat-option`).should('contain.text', 'bg');
    cy.contains(`mat-option`, 'bg').click();
    cy.get(`[data-test="settings-subtitle"]`).should('contain.text', 'test2');
  });
  it('should be able to change theme', () => {
    cy.get(`[data-test="theme-selection"]`).click();
    cy.get(`mat-option`).should('contain.text', 'dark');
    cy.get(`mat-option`).should('contain.text', 'light');
    cy.contains(`mat-option`, 'dark').click();
    cy.get(`body`).should('have.class', 'dark');
    cy.get(`[data-test="theme-selection"]`).click();
    cy.contains(`mat-option`, 'light').click();
    cy.get(`body`).should('not.have.class', 'dark');
  });
});
