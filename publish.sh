#!/bin/bash

# publish.sh - A simple tool to publish blog posts from newblog25 to _notes

# Check if a filename was provided
if [ $# -eq 0 ]; then
    echo "Usage: ./publish.sh filename.md"
    echo "Please provide the filename to publish from the newblog25/ directory."
    exit 1
fi

FILENAME=$1

# Remove the @ symbol if it's present at the beginning of the filename
FILENAME=${FILENAME#@}

# Check if the file exists in the newblog25 directory
if [ ! -f "newblog25/$FILENAME" ]; then
    echo "Error: File 'newblog25/$FILENAME' not found."
    echo "Make sure the file exists in the newblog25/ directory."
    exit 1
fi

# Copy the file to the _notes directory
echo "Publishing $FILENAME..."
cp "newblog25/$FILENAME" "_notes/"

# Build the site
echo "Building the site..."
bundle exec jekyll build

echo "Success! $FILENAME has been published to _notes/ and the site has been built."
echo "You can now deploy your site or run 'bundle exec jekyll serve' to preview it locally." 