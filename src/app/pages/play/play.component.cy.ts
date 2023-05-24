import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayComponent } from './play.component';
import { HttpClientModule } from '@angular/common/http';
import countries from '../../../assets/countries.json';
import { createTranslocoTestingModule } from '../../transloco-testing.module';
import { MountConfig } from 'cypress/angular';
import { PlayType } from './play.service';

function generateConfig(type: PlayType): MountConfig<PlayComponent> {
  return {
    imports: [
      PlayComponent,
      HttpClientModule,
      RouterTestingModule,
      createTranslocoTestingModule(),
      NoopAnimationsModule
    ],
    componentProperties: {
      type
    }
  };
}

describe('PlayComponent', () => {
  beforeEach(() => {
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
    cy.get(`[data-test="country-input"] input`).type('Dominican Republic');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="success-guess"]`).should('exist');
  });
  it('should be able to not guess correctly a flag', () => {
    cy.mount(PlayComponent, generateConfig('FLAG'));
    cy.get(`[data-test="country-input"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Bulgaria');
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Turkey');
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Germany');
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Austria');
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Australia');
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="fail-guess"]`).should('exist');
  });
  it('should be able to guess correctly a shape', () => {
    cy.mount(PlayComponent, generateConfig('SHAPE'));
    cy.get(`[data-test="country-input"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Suriname');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="success-guess"]`).should('exist');
  });
  it('should be able to not guess correctly a shape', () => {
    cy.mount(PlayComponent, generateConfig('SHAPE'));
    cy.get(`[data-test="country-input"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Bulgaria');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Turkey');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Germany');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Austria');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Australia');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="fail-guess"]`).should('exist');
  });
});
