# Setting Up Automatic Daily Fleeting Notes

This guide explains how to set up automatic creation of fleeting notes using cron (on macOS/Linux).

## Step 1: Make sure the script paths are absolute

The automation script uses relative paths, which might not work correctly with cron. Make sure your script paths in `scripts/daily_fleeting_automation.js` are absolute if you encounter issues.

## Step 2: Set up a cron job

1. Open your terminal
2. Edit your crontab with:
   ```
   crontab -e
   ```

3. Add the following line to run the script daily at 6:00 AM:
   ```
   0 6 * * * /Users/scotttaylor/Documents/Projects/newblog25/scripts/run_daily_automation.sh >> /Users/scotttaylor/Documents/Projects/newblog25/daily_automation.log 2>&1
   ```

   This will:
   - Run the script at 6:00 AM every day
   - Log any output to `daily_automation.log` in your project directory

4. Save and exit the editor (usually with `:wq` if using vim)

## Step 3: Alternative with launchd (macOS)

On macOS, you might prefer using launchd instead of cron:

1. Create a plist file at `~/Library/LaunchAgents/com.yourusername.dailyfleeting.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.yourusername.dailyfleeting</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/scotttaylor/Documents/Projects/newblog25/scripts/run_daily_automation.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>6</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/Users/scotttaylor/Documents/Projects/newblog25/daily_automation.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/scotttaylor/Documents/Projects/newblog25/daily_automation_error.log</string>
</dict>
</plist>
```

2. Load the job with:
   ```
   launchctl load ~/Library/LaunchAgents/com.yourusername.dailyfleeting.plist
   ```

## Testing

To test if your setup is working:

1. Run the script manually:
   ```
   ./scripts/run_daily_automation.sh
   ```

2. Check if the script properly:
   - Creates a new fleeting note (if one doesn't exist for today)
   - Commits and pushes the changes to GitHub
   - Triggers a Netlify build

## Troubleshooting

If the automation doesn't work:

1. Check the log file for errors
2. Make sure the script has execute permissions (`chmod +x scripts/daily_fleeting_automation.js`)
3. Try using absolute paths in the script
4. Verify your Git and Netlify credentials are available to the cron job

With this setup, a new fleeting note should be created every day at the scheduled time, committed to GitHub, and your Netlify site will be rebuilt automatically. 