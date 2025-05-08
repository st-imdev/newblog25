#!/usr/bin/env node

// This script adds placeholder content to any fleeting note files that are empty

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
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  // Skip files that already have content
  if (originalContent.includes('Placeholder') || originalContent.trim().split('\n').length > 7) {
    console.log(`Skipping ${filename} - already has content`);
    return;
  }
  
  // Add placeholder content after frontmatter
  let newContent;
  if (originalContent.startsWith('---')) {
    // Find where the frontmatter ends
    const secondDashIndex = originalContent.indexOf('---', 3);
    if (secondDashIndex !== -1) {
      newContent = originalContent.substring(0, secondDashIndex + 3) + '\n\nPlaceholder for future notes.\n';
    } else {
      // Incomplete frontmatter, add a closing ---
      newContent = originalContent.trim() + '\n---\n\nPlaceholder for future notes.\n';
    }
  } else {
    // No frontmatter, create one
    const dateStr = filename.replace('.md', '');
    newContent = `---\ndate: ${dateStr}\nslug: "${dateStr}"\nlayout: fleeting\n---\n\nPlaceholder for future notes.\n`;
  }
  
  fs.writeFileSync(filePath, newContent);
  console.log(`Updated ${filename}`);
  updated++;
});

console.log(`Done! Updated ${updated} files.`); 