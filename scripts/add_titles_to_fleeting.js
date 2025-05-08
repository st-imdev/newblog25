#!/usr/bin/env node

// This script adds formatted titles to all fleeting note files
// Title format: "8th May, 2025"

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

// Get all .md files in the _fleeting directory
const files = fs.readdirSync(FLEETING_DIR)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(FLEETING_DIR, file));

let updated = 0;

// Process each file
files.forEach(filePath => {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract date from filename (YYYY-MM-DD)
  const dateFromFilename = filename.replace('.md', '');
  
  // Use regex to extract frontmatter
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    console.log(`No frontmatter found in ${filename}, skipping`);
    return;
  }
  
  const frontmatterText = frontmatterMatch[1];
  const bodyContent = content.substring(frontmatterMatch[0].length);
  
  // Parse frontmatter into lines
  const frontmatterLines = frontmatterText.split('\n')
    .filter(line => line.trim());
  
  // Create a map of frontmatter fields
  const frontmatterMap = frontmatterLines.reduce((obj, line) => {
    const [key, ...valueParts] = line.split(':');
    if (key) {
      obj[key.trim()] = valueParts.join(':').trim();
    }
    return obj;
  }, {});
  
  // Get the date to use for the title
  const dateStr = frontmatterMap.date ? 
    frontmatterMap.date.split(' ')[0] : // Extract just the date part
    dateFromFilename;
  
  // Create the formatted title
  const formattedTitle = formatTitleDate(dateStr);
  const titleValue = `"${formattedTitle}"`;
  
  // Check if title needs to be updated
  let isUpdated = false;
  if (!frontmatterMap.title || frontmatterMap.title !== titleValue) {
    frontmatterMap.title = titleValue;
    isUpdated = true;
  }
  
  if (isUpdated) {
    // Recreate frontmatter
    const newFrontmatter = Object.entries(frontmatterMap)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    const newContent = `---\n${newFrontmatter}\n---${bodyContent}`;
    
    fs.writeFileSync(filePath, newContent);
    console.log(`Added title "${formattedTitle}" to ${filename}`);
    updated++;
  } else {
    console.log(`Title already set correctly in ${filename}`);
  }
});

console.log(`Done! Updated ${updated} files.`); 