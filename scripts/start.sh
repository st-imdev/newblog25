#!/bin/bash

# Run the notes watcher in the background
./scripts/watch_notes.sh &
WATCH_PID=$!

# Trap to kill the watcher when this script exits
trap "kill $WATCH_PID" EXIT

# Start Jekyll
bundle exec jekyll serve --livereload

# Kill the watcher explicitly
kill $WATCH_PID 