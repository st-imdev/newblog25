#!/usr/bin/env node

// This script ensures all fleeting note files have a consistent date format with time
// Standardizes to: date: YYYY-MM-DD HH:MM

const fs = require('fs');
const path = require('path');

const FLEETING_DIR = path.join(__dirname, '..', '_fleeting');

// Ensure the directory exists
if (!fs.existsSync(FLEETING_DIR)) {
  console.error(`ERROR: Directory ${FLEETING_DIR} does not exist`);
  process.exit(1);
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
  
  // Extract and parse frontmatter lines
  const frontmatterLines = frontmatterText.split('\n')
    .filter(line => line.trim())
    .reduce((obj, line) => {
      const [key, ...valueParts] = line.split(':');
      if (key) {
        obj[key.trim()] = valueParts.join(':').trim();
      }
      return obj;
    }, {});
  
  // Check if date needs to be updated
  let isUpdated = false;
  
  if (!frontmatterLines.date) {
    // No date, add one with 12:00 time
    frontmatterLines.date = `${dateFromFilename} 12:00`;
    isUpdated = true;
  } else if (!frontmatterLines.date.includes(':')) {
    // Date exists but has no time
    frontmatterLines.date = `${frontmatterLines.date} 12:00`;
    isUpdated = true;
  }
  
  // Ensure slug is set properly
  if (!frontmatterLines.slug || frontmatterLines.slug.replace(/"/g, '') !== dateFromFilename) {
    frontmatterLines.slug = `"${dateFromFilename}"`;
    isUpdated = true;
  }
  
  // Ensure layout is set
  if (!frontmatterLines.layout || frontmatterLines.layout !== 'fleeting') {
    frontmatterLines.layout = 'fleeting';
    isUpdated = true;
  }
  
  if (isUpdated) {
    // Recreate frontmatter
    const newFrontmatter = Object.entries(frontmatterLines)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    
    const newContent = `---\n${newFrontmatter}\n---${bodyContent}`;
    
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated date format in ${filename}`);
    updated++;
  }
});

console.log(`Done! Updated ${updated} files.`); 