#!/bin/bash

# Initial copy
./scripts/copy_notes.sh

# Watch for changes and update
echo "Watching for changes in newblog25 directory..."
fswatch -o newblog25 | while read f; do
  echo "Changes detected, updating links..."
  ./scripts/copy_notes.sh
done 