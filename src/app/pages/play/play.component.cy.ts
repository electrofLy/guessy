import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayComponent } from './play.component';
import { HttpClientModule } from '@angular/common/http';
import countries from '../../../assets/countries.json';
import { createTranslocoTestingModule } from '../../transloco-testing.module';
import { MountConfig } from 'cypress/angular';
import { PLAY_TYPE, PlayType } from './play.service';
import { CountriesService, extractCountryName } from '../../core/services/countries.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

function generateConfig(type: PlayType): MountConfig<PlayComponent> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const translatedCountries = extractCountryName(countries, 'en');

  return {
    imports: [PlayComponent, HttpClientModule, RouterTestingModule, NoopAnimationsModule],
    providers: [
      createTranslocoTestingModule(),
      { provide: PLAY_TYPE, useValue: type },
      {
        provide: CountriesService,
        useValue: {
          countryNames$: of([...translatedCountries.map((country) => country.name)])
        } as Partial<CountriesService>
      },
      {
        provide: ActivatedRoute,
        useValue: {
          data: of({
            countries: [...translatedCountries]
          })
        }
      }
    ]
  };
}

describe('PlayComponent', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clock().invoke('setSystemTime', 60 * 60 * 1000);
    cy.intercept('/assets/countries.json', {
      statusCode: 200,
      body: [...countries],
      headers: { 'content-type': 'application/json' }
    });
  });

  it('should mount', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
  });

  it('should be able to guess correctly a flag', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Dominica');
    cy.get(`[data-test="success-guess"]`).should('exist');
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="success-guess"]`).should('exist');
  });
  it('should be able to guess correctly a by clicking mat option', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Domini');
    cy.get(`mat-option`).should('contain.text', 'Dominica').first().click();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="success-guess"]`).should('exist');
  });

  it('should be able to not guess correctly a flag', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Bulgaria');
    fillGuess('Turkey');
    fillGuess('Germany');
    fillGuess('Austria');
    fillGuess('Australia');

    cy.get(`[data-test="fail-guess"]`).should('exist');
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="fail-guess"]`).should('exist');
  });

  it('should be able to guess correctly a shape', () => {
    cy.mount(PlayComponent, generateConfig('SHAPE'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Sudan');
    cy.get(`[data-test="success-guess"]`).should('exist');
  });

  it('should be able to not guess correctly a shape', () => {
    cy.mount(PlayComponent, generateConfig('SHAPE'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Bulgaria');
    fillGuess('Turkey');
    fillGuess('Germany');
    fillGuess('Austria');
    fillGuess('Australia');
    cy.get(`[data-test="fail-guess"]`).should('exist');
  });

  it('should not be able to submit invalid country', () => {
    cy.mount(PlayComponent, generateConfig('SHAPE'));
    cy.get(`[data-test="country-input"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Nonexistenlandia');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).should('be.disabled');
  });

  it('should be able to get a new country after submission and time up', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Dominica');
    cy.get(`[data-test="success-guess"]`).should('exist');

    cy.clock().invoke('setSystemTime', 100000000000000);
    cy.clearAllLocalStorage();
    cy.mount(PlayComponent, generateConfig('FLAG'));

    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Dominica');
    cy.get(`[data-test="country-input"] input`).should('exist');
  });
  it('should be able to save to not ended to local storage', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Bulgaria');
    cy.get(`[data-test="guess-list-item"]`).should('contain.text', 'Bulgaria');
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="guess-list-item"]`).should('contain.text', 'Bulgaria');
  });

  it('should be able to save success statistics', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Dominica');
    cy.get(`[data-test="success-guess"]`).should('exist');

    cy.clock().invoke('setSystemTime', 100000000000000);
    cy.mount(PlayComponent, generateConfig('FLAG'));

    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Greece');

    cy.get(`[data-test="stat-success"] .mat-badge-content`).should('have.text', '2');
    cy.get(`[data-test="stat-fail"] .mat-badge-content`).should('have.text', '0');
  });

  it('should be able to save fail statistics', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Greece');
    fillGuess('Greece');
    fillGuess('Greece');
    fillGuess('Greece');
    fillGuess('Greece');

    cy.clock().invoke('setSystemTime', 100000000000000);
    cy.mount(PlayComponent, generateConfig('FLAG'));

    cy.get(`[data-test="country-input"]`).click();
    fillGuess('Dominica');
    fillGuess('Dominica');
    fillGuess('Dominica');
    fillGuess('Dominica');
    fillGuess('Dominica');

    cy.get(`[data-test="stat-fail"] .mat-badge-content`).should('have.text', '2');
    cy.get(`[data-test="stat-success"] .mat-badge-content`).should('have.text', '0');
  });
});

function fillGuess(guess: string) {
  cy.get(`[data-test="country-input"] input`).type(guess);
  cy.get(`[data-test="country-input"] input`).blur();
  cy.get(`[data-test="submit-guess"]`).click();
}
