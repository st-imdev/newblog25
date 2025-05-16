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

// Get today's date
const now = new Date();
const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
const filePath = path.join(FLEETING_DIR, `${dateStr}.md`);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.log(`File ${dateStr}.md already exists, no need to create it`);
} else {
  // Create the new fleeting note
  const formattedTitle = formatTitleDate(dateStr);
  const content = `---
date: ${dateStr} 12:00
slug: "${dateStr}"
title: "${formattedTitle}"
layout: fleeting
---

Daily notes for ${formattedTitle}.
`;
  
  // Write the file
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${dateStr}.md with title "${formattedTitle}"`);
    
    // Commit and push to Git
    try {
      // Stage the file
      execSync(`git add "${filePath}"`, { stdio: 'inherit' });
      
      // Commit
      execSync(`git commit -m "Add fleeting note for ${dateStr}"`, { stdio: 'inherit' });
      
      // Pull recent changes (with rebase to avoid conflicts)
      execSync(`git pull --rebase ${GIT_REMOTE} ${GIT_BRANCH}`, { stdio: 'inherit' });
      
      // Push
      execSync(`git push ${GIT_REMOTE} ${GIT_BRANCH}`, { stdio: 'inherit' });
      
      console.log(`Committed and pushed ${dateStr}.md to GitHub`);
    } catch (gitError) {
      console.error('Git operation failed:', gitError.message);
      // Continue to trigger Netlify build even if git operations fail
    }
  } catch (err) {
    console.error(`ERROR creating ${dateStr}.md:`, err);
    process.exit(1);
  }
}

// Trigger Netlify build hook even if no new file was created
// This ensures any existing content gets deployed
console.log('Triggering Netlify build...');
triggerNetlifyBuild()
  .then(() => {
    console.log('Netlify build triggered successfully');
  })
  .catch((error) => {
    console.error('Failed to trigger Netlify build:', error.message);
    process.exit(1);
  }); 