#!/usr/bin/env node

// This script checks all fleeting note files and displays their status

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
  .sort() // Sort by filename/date
  .map(file => path.join(FLEETING_DIR, file));

console.log(`Found ${files.length} fleeting note files`);
console.log('-'.repeat(50));

// Process each file
files.forEach(filePath => {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract date from the frontmatter
  let frontmatterDate = 'MISSING';
  let hasTime = false;
  let hasLayout = false;
  let hasSlug = false;
  let hasContent = false;
  
  if (content.startsWith('---')) {
    const frontmatterMatch = content.match(/date:\s*([^\n]+)/);
    if (frontmatterMatch && frontmatterMatch[1]) {
      frontmatterDate = frontmatterMatch[1].trim();
      hasTime = frontmatterDate.includes(':');
    }
    
    hasLayout = /layout:\s*fleeting/i.test(content);
    hasSlug = /slug:/i.test(content);
    
    // Check for content after frontmatter
    const parts = content.split('---');
    if (parts.length >= 3) {
      const bodyContent = parts.slice(2).join('---').trim();
      hasContent = bodyContent.length > 0;
    }
  }
  
  console.log(`File: ${filename}`);
  console.log(`  Date: ${frontmatterDate} ${hasTime ? '✅ (has time)' : '❌ (no time)'}`);
  console.log(`  Layout: ${hasLayout ? '✅' : '❌'}`);
  console.log(`  Slug: ${hasSlug ? '✅' : '❌'}`);
  console.log(`  Content: ${hasContent ? '✅' : '❌'}`);
  console.log('-'.repeat(50));
});

console.log('Done checking files.'); 