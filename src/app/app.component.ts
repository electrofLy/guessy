import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoomsHttpService } from './api/rooms.http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  rooms$ = this.roomsHttpService.get();
  constructor(private roomsHttpService: RoomsHttpService) {}
}
