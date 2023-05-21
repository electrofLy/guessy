import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({
  template: `dummy`
})
class DummyComponent {}

describe('HomeComponentComponent', () => {
  beforeEach(() => {
    cy.mount(HomeComponent, {
      declarations: [DummyComponent],
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([
          { path: 'flag', component: DummyComponent },
          { path: 'shape', component: DummyComponent },
          { path: 'settings', component: DummyComponent },
          {
            path: 'information',
            component: DummyComponent
          }
        ])
      ]
    });
  });

  it('should be able to navigate', () => {
    cy.get(`[data-test="go-to-flag"]`).click();
    cy.get(`[data-test="go-to-shape"]`).click();
    cy.get(`[data-test="go-to-settings"]`).click();
    cy.get(`[data-test="go-to-information"]`).click();
  });
});
