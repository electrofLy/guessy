import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home',
  template: ` <div class="h-full w-full flex justify-center items-center">
    <mat-card>
      <mat-card-title>Guessy</mat-card-title>
      <mat-card-content class="flex flex-col justify-center">
        <div class="flex flex-col gap-2">
          <button mat-button mat-raised-button color="primary">Play</button>
          <button mat-button mat-raised-button color="primary">Rooms</button>
          <button mat-button mat-raised-button color="primary">Info</button>
        </div>
      </mat-card-content>
    </mat-card>
  </div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
