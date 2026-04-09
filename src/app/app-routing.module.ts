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
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
