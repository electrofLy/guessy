import { InformationComponent } from './information.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('InformationComponent', () => {
  it('should be able to mount', () => {
    cy.mount(InformationComponent, {
      imports: [InformationComponent, RouterTestingModule]
    });
    cy.get(`mat-card`).should('exist');
  });
});
