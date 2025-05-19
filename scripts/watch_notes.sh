#!/bin/bash

# Initial copy
./scripts/copy_notes.sh
# Clean up placeholders in fleeting notes
node ./scripts/remove_placeholder_from_fleeting.js

# Watch for changes and update
echo "Watching for changes in newblog25 and _fleeting directories..."
fswatch -o newblog25 _fleeting | while read f; do
  echo "Changes detected, updating links and cleaning placeholders..."
  ./scripts/copy_notes.sh
  node ./scripts/remove_placeholder_from_fleeting.js
done
