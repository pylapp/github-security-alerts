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

use std::sync::Mutex;
use std::time::Instant;
use crate::models::AppConfig;

pub struct AppState {
    pub alert_count: Mutex<usize>,
    pub last_shown: Mutex<Option<Instant>>,
    pub last_focus_lost: Mutex<Option<Instant>>,
    pub auto_hide_paused: Mutex<bool>,
    pub config: Mutex<AppConfig>,
}