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

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { UpdateService } from '../../../core/services';

type ViewMode = 'alerts' | 'repos' | 'settings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() authenticated = false;
  @Input() alertsLoading = false;
  @Input() currentView: ViewMode = 'alerts';

  @Output() refresh = new EventEmitter<void>();
  @Output() viewChange = new EventEmitter<ViewMode>();

  updateAvailable = false;
  isUpdating = false;

  constructor(private updateService: UpdateService) {}

  ngOnInit(): void {
    // Update status is managed by UpdateService automatically
    if (this.updateService.isTauri) {
      this.updateAvailable = this.updateService.updateAvailable;
    }
  }

  ngOnDestroy(): void {
    // Nothing to clean up
  }

  async onUpdateClick(): Promise<void> {
    if (this.isUpdating) return;

    this.isUpdating = true;
    try {
      await this.updateService.installUpdate();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  showAlerts(): void {
    this.viewChange.emit('alerts');
  }

  showRepos(): void {
    this.viewChange.emit('repos');
  }

  showSettings(): void {
    this.viewChange.emit('settings');
  }
}
