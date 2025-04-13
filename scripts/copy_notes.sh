#!/bin/bash

# Clear existing _notes directory
rm -rf _notes/*

# Find all markdown files in newblog25 and its subdirectories
find newblog25 -name "*.md" | while read file; do
  # Create symlink in _notes directory
  filename=$(basename "$file")
  ln -sf "../$file" "_notes/$filename"
  echo "Linked $file to _notes/$filename"
done

echo "Done! All markdown files from newblog25 have been linked to _notes." 