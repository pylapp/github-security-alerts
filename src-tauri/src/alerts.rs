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

use tauri::Manager;
use crate::models::{AlertsResponse, RepoAlerts, GitHubAlert};
use crate::state::AppState;

// ============================================================================
// Security Alerts Commands
// ============================================================================

#[tauri::command]
pub async fn get_github_security_alerts(app: tauri::AppHandle) -> Result<AlertsResponse, String> {
    let (token, repos) = {
        let state = app.try_state::<AppState>().ok_or("No state")?;
        let config = state.config.lock().unwrap();
        (
            config.access_token.clone().ok_or("Not authenticated")?,
            config.selected_repos.clone(),
        )
    };

    if repos.is_empty() {
        return Ok(AlertsResponse {
            total_alerts: 0,
            repos: vec![],
        });
    }

    let mut total_alerts = 0;
    let mut repo_alerts = Vec::new();
    let client = reqwest::Client::new();

    for repo in repos {
        let url = format!(
            "https://api.github.com/repos/{}/dependabot/alerts",
            repo
        );

        match client
            .get(&url)
            .header("Accept", "application/vnd.github+json")
            .header("Authorization", format!("Bearer {}", token))
            .header("User-Agent", "github-security-alerts")
            .send()
            .await
        {
            Ok(response) => {
                let status = response.status();

                if status == 422 {
                    // 422 Unprocessable Entity: Dependabot not enabled on this repo
                    eprintln!("[{}] Dependabot not enabled (HTTP 422)", repo);
                    repo_alerts.push(RepoAlerts {
                        name: repo,
                        alerts: 0,
                        dependabot_enabled: false,
                        error: None,
                    });
                } else if !status.is_success() {
                    // Any other non-2xx: capture the raw body for a useful error message
                    let body = response.text().await.unwrap_or_default();
                    let msg = format!("HTTP {} — {}", status.as_u16(), body);
                    eprintln!("[{}] GitHub API error: {}", repo, msg);
                    repo_alerts.push(RepoAlerts {
                        name: repo,
                        alerts: 0,
                        dependabot_enabled: false,
                        error: Some(msg),
                    });
                } else {
                    // 2xx: try to parse the JSON body
                    // Read raw bytes first so we can log them if parsing fails
                    match response.bytes().await {
                        Ok(bytes) => {
                            match serde_json::from_slice::<Vec<GitHubAlert>>(&bytes) {
                                Ok(alerts) => {
                                    let open_alerts = alerts.iter()
                                        .filter(|a| a.state == "open")
                                        .count();
                                    total_alerts += open_alerts;
                                    repo_alerts.push(RepoAlerts {
                                        name: repo,
                                        alerts: open_alerts,
                                        dependabot_enabled: true,
                                        error: None,
                                    });
                                }
                                Err(e) => {
                                    // Log the raw body so we can see what GitHub actually returned
                                    let raw = String::from_utf8_lossy(&bytes);
                                    let msg = format!("JSON parse error: {} — body: {}", e, raw);
                                    eprintln!("[{}] {}", repo, msg);
                                    repo_alerts.push(RepoAlerts {
                                        name: repo,
                                        alerts: 0,
                                        dependabot_enabled: false,
                                        error: Some(format!("JSON parse error: {}", e)),
                                    });
                                }
                            }
                        }
                        Err(e) => {
                            let msg = format!("Error reading response body: {}", e);
                            eprintln!("[{}] {}", repo, msg);
                            repo_alerts.push(RepoAlerts {
                                name: repo,
                                alerts: 0,
                                dependabot_enabled: false,
                                error: Some(msg),
                            });
                        }
                    }
                }
            }
            Err(e) => {
                let msg = format!("Network error: {}", e);
                eprintln!("[{}] {}", repo, msg);
                repo_alerts.push(RepoAlerts {
                    name: repo,
                    alerts: 0,
                    dependabot_enabled: false,
                    error: Some(msg),
                });
            }
        }
    }

    Ok(AlertsResponse {
        total_alerts,
        repos: repo_alerts,
    })
}
