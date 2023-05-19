import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="h-full w-full flex justify-center items-center">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {}
