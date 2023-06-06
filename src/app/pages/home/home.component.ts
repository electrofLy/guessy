import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  template: ` <mat-card>
      <mat-card-header class="justify-center">
        <mat-card-title class="text-center p-2">{{ 'guessy' | transloco }}</mat-card-title>
      </mat-card-header>
      <mat-card-content class="!flex flex-col justify-center">
        <div class="flex flex-col gap-2">
          <button [routerLink]="['/flag']" data-test="go-to-flag" mat-button mat-raised-button color="primary">
            {{ 'flag' | transloco }}
          </button>
          <button [routerLink]="['/shape']" data-test="go-to-shape" mat-button mat-raised-button color="primary">
            {{ 'shape' | transloco }}
          </button>
          <mat-divider />
          <button [routerLink]="['/settings']" data-test="go-to-settings" mat-button mat-raised-button color="primary">
            {{ 'settings' | transloco }}
          </button>
          <button
            [routerLink]="['/information']"
            data-test="go-to-information"
            mat-button
            mat-raised-button
            color="primary"
          >
            {{ 'info' | transloco }}
          </button>
        </div>
      </mat-card-content>
    </mat-card>
    <div class="absolute bottom-2 right-2 flex flex-row gap-1">
      <a
        [matTooltip]="'checkCode' | transloco"
        mat-mini-fab
        target="_blank"
        href="https://github.com/electrofLy/guessy"
      >
        <mat-icon>code</mat-icon>
      </a>
      <a
        [matTooltip]="'reportIssue' | transloco"
        mat-mini-fab
        target="_blank"
        href="https://github.com/electrofLy/guessy/issues"
      >
        <mat-icon>bug_report</mat-icon>
      </a>
    </div>`,
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
    HomeComponent,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class HomeComponent {}
