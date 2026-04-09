/*
 * Software Name : GitHub Security Alerts
 * SPDX-FileCopyrightText: Copyright (c) Orange
 * SPDX-License-Identifier: MIT
 * 
 * This software is distributed under the MIT,
 * see the "LICENSE.txt" file for more details or https://opensource.org/license/mit
 * 
 * Software description: A modern desktop application that monitors security vulnerabilities across your GitHub repositories in real-time.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import {
  PageNotFoundComponent,
  HeaderComponent,
  LoginPanelComponent,
  SettingsPanelComponent,
  ReposPanelComponent,
  AlertsListComponent,
  FooterComponent,
  RateLimitStatusComponent,
} from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    WebviewDirective,
    HeaderComponent,
    LoginPanelComponent,
    SettingsPanelComponent,
    ReposPanelComponent,
    AlertsListComponent,
    FooterComponent,
    RateLimitStatusComponent,
  ],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    HeaderComponent,
    LoginPanelComponent,
    SettingsPanelComponent,
    ReposPanelComponent,
    AlertsListComponent,
    FooterComponent,
    RateLimitStatusComponent,
  ]
})
export class SharedModule {}
