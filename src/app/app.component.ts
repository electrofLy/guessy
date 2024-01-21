import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
    <div class="h-full w-full flex justify-center">
      <div class="m-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  constructor() {
    if (!environment.production) {
      console.warn('Local storage cleared on reset. Disable to test local storage.');
      // localStorage.clear();
    }
  }
}
