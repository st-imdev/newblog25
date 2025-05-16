#!/bin/bash

# Navigate to the project directory (adjust this path as needed)
cd "$(dirname "$0")/.." || exit 1

# Make sure the automation script is executable
chmod +x scripts/daily_fleeting_automation.js

# Run the automation script
node scripts/daily_fleeting_automation.js 