import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-information',
  template: ` <mat-card>
    <mat-card-title class="text-center">{{ 'guessy' | transloco }}</mat-card-title>
    <mat-card-subtitle class="text-center">{{ 'info' | transloco }}</mat-card-subtitle>
    <mat-card-content class="!flex flex-col justify-center max-w-s">
      <p class="whitespace-pre-wrap">{{ 'infoDetails' | transloco }}</p>
    </mat-card-content>
    <mat-card-actions [align]="'end'">
      <button [routerLink]="['/home']" mat-button mat-raised-button>
        {{ 'back' | transloco }}
      </button>
    </mat-card-actions>
  </mat-card>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    TranslocoModule,
    CommonModule,
    MatCardModule,
    TranslocoModule,
    MatButtonModule,
    InformationComponent
  ]
})
export class InformationComponent {}
