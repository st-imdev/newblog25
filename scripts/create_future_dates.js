#!/usr/bin/env node

// This script manually creates fleeting note files for the next 7 days

const fs = require('fs');
const path = require('path');

const FLEETING_DIR = path.join(__dirname, '..', '_fleeting');

// Ensure the directory exists
if (!fs.existsSync(FLEETING_DIR)) {
  console.error(`ERROR: Directory ${FLEETING_DIR} does not exist`);
  process.exit(1);
}

const now = new Date();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Create files for today and the next 7 days
for (let offset = 0; offset <= 7; offset++) {
  const targetDate = new Date(now.getTime() + offset * ONE_DAY_MS);
  const dateStr = targetDate.toISOString().slice(0, 10); // YYYY-MM-DD
  const filePath = path.join(FLEETING_DIR, `${dateStr}.md`);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`File ${dateStr}.md already exists, skipping`);
    continue;
  }
  
  // Create content for the file
  const content = `---
date: ${dateStr}
slug: "${dateStr}"
layout: fleeting
---

Placeholder for future notes.
`;
  
  // Write the file
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${dateStr}.md`);
  } catch (err) {
    console.error(`ERROR creating ${dateStr}.md:`, err);
  }
}

console.log('Done creating fleeting note files'); 