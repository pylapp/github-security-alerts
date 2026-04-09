#!/usr/bin/env node

/**
 * Script to add license headers to source files
 * Supports: .html, .css, .js, .ts, .rs files
 */

const fs = require('fs');
const path = require('path');

const HEADER_TEXT = `Software Name : GitHub Security Alerts
SPDX-FileCopyrightText: Copyright (c) Orange
SPDX-License-Identifier: MIT

This software is distributed under the MIT,
see the "LICENSE.txt" file for more details or https://opensource.org/license/mit

Software description: A modern desktop application that monitors security vulnerabilities across your GitHub repositories in real-time.`;

// Comment formats for different file types
const COMMENT_FORMATS = {
  js: { start: '/*\n', prefix: ' * ', end: ' */\n\n' },
  ts: { start: '/*\n', prefix: ' * ', end: ' */\n\n' },
  css: { start: '/*\n', prefix: ' * ', end: ' */\n\n' },
  scss: { start: '/*\n', prefix: ' * ', end: ' */\n\n' },
  rs: { start: '/*\n', prefix: ' * ', end: ' */\n\n' },
  html: { start: '<!--\n', prefix: '  ', end: '-->\n\n' }
};

// Directories to exclude
const EXCLUDE_DIRS = [
  'node_modules',
  'dist',
  'build',
  'target',
  '.git',
  'coverage',
  '.vscode',
  '.idea'
];

/**
 * Generate header for a specific file type
 */
function generateHeader(extension) {
  const format = COMMENT_FORMATS[extension];
  if (!format) return null;

  const lines = HEADER_TEXT.split('\n');
  let header = format.start;
  
  for (const line of lines) {
    header += format.prefix + line + '\n';
  }
  
  header += format.end;
  return header;
}

/**
 * Check if file already has the header
 */
function hasHeader(content) {
  // Check for presence of key identifier
  return content.includes('Software Name : GitHub Security Alerts') ||
         content.includes('SPDX-FileCopyrightText: Copyright (c) Orange');
}

/**
 * Add header to file content
 */
function addHeaderToFile(filePath) {
  const ext = path.extname(filePath).slice(1);
  
  if (!COMMENT_FORMATS[ext]) {
    return false; // Unsupported file type
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (hasHeader(content)) {
      console.log(`⏭️  Skipped (already has header): ${filePath}`);
      return false;
    }

    const header = generateHeader(ext);
    if (!header) {
      return false;
    }

    const newContent = header + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Added header: ${filePath}`);
    return true;

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dirPath, stats = { processed: 0, skipped: 0, errors: 0 }) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDE_DIRS.includes(entry.name)) {
        continue;
      }
      scanDirectory(fullPath, stats);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).slice(1);
      
      if (COMMENT_FORMATS[ext]) {
        const result = addHeaderToFile(fullPath);
        if (result) {
          stats.processed++;
        } else {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (hasHeader(content)) {
            stats.skipped++;
          }
        }
      }
    }
  }

  return stats;
}

/**
 * Main execution
 */
function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  console.log('🚀 Starting header generation...');
  console.log(`📁 Root directory: ${rootDir}\n`);

  const stats = scanDirectory(rootDir);

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Headers added: ${stats.processed}`);
  console.log(`   ⏭️  Files skipped: ${stats.skipped}`);
  console.log('='.repeat(50));
}

// Run the script
main();
