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

use tauri::command;

// ============================================================================
// System Settings
// ============================================================================

#[command]
pub fn open_taskbar_settings() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        
        Command::new("cmd")
            .args(&["/C", "start", "ms-settings:taskbar"])
            .spawn()
            .map_err(|e| format!("Failed to open taskbar settings: {}", e))?;
        Ok(())
    }

    #[cfg(not(target_os = "windows"))]
    {
        Err("Taskbar settings are only available on Windows".to_string())
    }
}
