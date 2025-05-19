#!/usr/bin/env node

// Remove the placeholder line from any fleeting note that has additional content.

const fs = require('fs');
const path = require('path');

const FLEETING_DIR = path.join(__dirname, '..', '_fleeting');

if (!fs.existsSync(FLEETING_DIR)) {
  console.error(`ERROR: Directory ${FLEETING_DIR} does not exist`);
  process.exit(1);
}

const PLACEHOLDER_TEXT = 'Placeholder for future notes.';

const files = fs.readdirSync(FLEETING_DIR)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(FLEETING_DIR, file));

let updated = 0;

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const placeholderIndex = lines.findIndex(line => line.trim() === PLACEHOLDER_TEXT);
  if (placeholderIndex === -1) return; // no placeholder

  // Any non-empty lines after the placeholder?
  const afterLines = lines.slice(placeholderIndex + 1).some(line => line.trim() !== '');
  if (afterLines) {
    lines.splice(placeholderIndex, 1);
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Removed placeholder from ${path.basename(filePath)}`);
    updated++;
  }
});

console.log(`Done! Updated ${updated} files.`);
