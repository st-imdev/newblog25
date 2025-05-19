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

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const now = new Date();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Create files for today and the next 7 days
for (let offset = 0; offset <= 7; offset++) {
  const targetDate = new Date(now.getTime() + offset * ONE_DAY_MS);
  const dateStr = getLocalDateString(targetDate);
  const filePath = path.join(FLEETING_DIR, `${dateStr}.md`);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`File ${dateStr}.md already exists, skipping`);
    continue;
  }
  
  // Format the title
  const formattedTitle = formatTitleDate(dateStr);
  
  // Create content for the file
  const content = `---
date: ${dateStr} 12:00
slug: "${dateStr}"
title: "${formattedTitle}"
layout: fleeting
---

Placeholder for future notes.
`;
  
  // Write the file
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${dateStr}.md with title "${formattedTitle}"`);
  } catch (err) {
    console.error(`ERROR creating ${dateStr}.md:`, err);
  }
}

console.log('Done creating fleeting note files.'); 