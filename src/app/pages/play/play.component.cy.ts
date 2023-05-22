import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayComponent } from './play.component';
import { HttpClientModule } from '@angular/common/http';
import countries from '../../../assets/countries.json';
import { createTranslocoTestingModule } from '../../transloco-testing.module';

describe('PlayComponent', () => {
  beforeEach(() => {
    cy.clock().invoke('setSystemTime', 60 * 60 * 1000);
    cy.intercept('/assets/countries.json', {
      statusCode: 200,
      body: [...countries],
      headers: { 'content-type': 'application/json' }
    });
    cy.mount(PlayComponent, {
      imports: [
        PlayComponent,
        HttpClientModule,
        RouterTestingModule,
        createTranslocoTestingModule(),
        NoopAnimationsModule
      ],
      componentProperties: {
        type: 'FLAG'
      }
    });
  });
  it('should be able to guess correctly', () => {
    cy.get(`[data-test="country-input"]`).click();
    cy.get(`[data-test="country-input"] input`).type('Dominican Republic');
    cy.get(`[data-test="country-input"] input`).blur();
    cy.get(`[data-test="submit-guess"]`).click();
    cy.get(`[data-test="success-guess"]`).should('exist');
  });
});
