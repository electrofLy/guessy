import { InformationComponent } from './information.component';
import { RouterTestingModule } from '@angular/router/testing';
import { createTranslocoTestingModule } from '../../transloco-testing.module';

describe('InformationComponent', () => {
  it('should be able to mount', () => {
    cy.mount(InformationComponent, {
      imports: [InformationComponent, RouterTestingModule],
      providers: [createTranslocoTestingModule()]
    });
    cy.get(`mat-card`).should('exist');
  });
});
