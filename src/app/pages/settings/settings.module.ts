import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LanguageSelectionComponent } from './language-selection/language-selection.component';
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';

@NgModule({
  declarations: [
    SettingsComponent,
    LanguageSelectionComponent,
    ThemeSelectionComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatCardModule,
    MatButtonModule,
    TranslocoModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class SettingsModule {}
