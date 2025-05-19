#!/usr/bin/env node

/**
 * daily_fleeting_automation.js
 * 
 * This script:
 * 1. Creates a new fleeting note for the current day (if it doesn't exist)
 * 2. Commits and pushes the changes to GitHub
 * 3. Triggers the Netlify build hook to deploy the site
 * 
 * Intended to be run daily by a cron job or scheduler
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

// Configuration
const FLEETING_DIR = path.join(__dirname, '..', '_fleeting');
const BUILD_HOOK_URL = 'https://api.netlify.com/build_hooks/681d86f9941c4c4e9bef4ede';
const GIT_REMOTE = 'origin';
const GIT_BRANCH = 'main';

// Ensure the directory exists
if (!fs.existsSync(FLEETING_DIR)) {
  console.error(`ERROR: Directory ${FLEETING_DIR} does not exist`);
  process.exit(1);
}

// Helper function to get ordinal suffix for a number
function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Helper function to format date as "8th May, 2025"
function formatTitleDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  
  // Format the month as full name
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}${suffix} ${month}, ${year}`;
}

// Format a Date object as YYYY-MM-DD in local time
function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Update yesterday's note if it only contains the default placeholder
function updatePreviousDay(now) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const prev = new Date(now.getTime() - ONE_DAY_MS);
  const prevStr = getLocalDateString(prev);
  const prevPath = path.join(FLEETING_DIR, `${prevStr}.md`);
  if (!fs.existsSync(prevPath)) return null;

  const content = fs.readFileSync(prevPath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const body = match[2].trim();
  if (/^Placeholder for future notes\.?(\s*)$/i.test(body)) {
    const frontmatter = `---\n${match[1]}\n---`;
    const newContent = `${frontmatter}\n\nNo entries recorded.\n`;
    fs.writeFileSync(prevPath, newContent);
    return prevPath;
  }

  return null;
}

// Helper function to trigger Netlify build hook
function triggerNetlifyBuild() {
  return new Promise((resolve, reject) => {
    const req = https.request(
      BUILD_HOOK_URL,
      { method: 'POST' },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData);
          } else {
            reject(new Error(`Netlify build trigger failed with status ${res.statusCode}: ${responseData}`));
          }
        });
      }
    );
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}


// Trigger Netlify build hook even if no new file was created
// This ensures any existing content gets deployed
// Get today's date
const now = new Date();
const dateStr = getLocalDateString(now);
const filePath = path.join(FLEETING_DIR, `${dateStr}.md`);

const filesToCommit = [];

// Create today's fleeting note if it doesn't exist
if (!fs.existsSync(filePath)) {
  const formattedTitle = formatTitleDate(dateStr);
  const content = `---
date: ${dateStr} 12:00
slug: "${dateStr}"
title: "${formattedTitle}"
layout: fleeting
---

Daily notes for ${formattedTitle}.
`;
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${dateStr}.md with title "${formattedTitle}"`);
    filesToCommit.push(filePath);
  } catch (err) {
    console.error(`ERROR creating ${dateStr}.md:`, err);
    process.exit(1);
  }
} else {
  console.log(`File ${dateStr}.md already exists, no need to create it`);
}

const updatedPrev = updatePreviousDay(now);
if (updatedPrev) {
  console.log(`Updated ${path.basename(updatedPrev)} with 'No entries recorded.'`);
  filesToCommit.push(updatedPrev);
}

if (filesToCommit.length > 0) {
  try {
    execSync(`git add ${filesToCommit.map(f => `"${f}"`).join(' ')}`, { stdio: 'inherit' });
    let message = `Add fleeting note for ${dateStr}`;
    if (filesToCommit.length > 1) {
      message += ' and update previous day';
    }
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    execSync(`git pull --rebase ${GIT_REMOTE} ${GIT_BRANCH}`, { stdio: 'inherit' });
    execSync(`git push ${GIT_REMOTE} ${GIT_BRANCH}`, { stdio: 'inherit' });
    console.log('Committed and pushed changes to GitHub');
  } catch (gitError) {
    console.error('Git operation failed:', gitError.message);
  }
}
console.log('Triggering Netlify build...');
triggerNetlifyBuild()
  .then(() => {
    console.log('Netlify build triggered successfully');
  })
  .catch((error) => {
    console.error('Failed to trigger Netlify build:', error.message);
    process.exit(1);
  }); 