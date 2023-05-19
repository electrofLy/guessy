import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponentComponent', () => {
  it('should mount', () => {
    cy.mount(HomeComponent, { imports: [HomeComponent, RouterTestingModule] });
  });
});
