# Fleeting Notes Maintenance Scripts

This directory contains scripts for maintaining the fleeting notes system.

## Scripts

### `create_future_dates.js`

Creates placeholder files for the next 7 days of fleeting notes.

```
node scripts/create_future_dates.js
```

### `normalize_fleeting_dates.js`

Ensures all fleeting note files have consistent frontmatter with:
- Dates that include time (adds 12:00 if missing)
- Correct slug values
- Proper layout setting

```
node scripts/normalize_fleeting_dates.js
```

### `check_fleeting_files.js`

Checks and displays the status of all fleeting note files, showing:
- Whether dates have time
- If layout is set correctly
- If slug is present
- If content exists

```
node scripts/check_fleeting_files.js
```

### `daily_fleeting_automation.js`

Creates the current day's fleeting note if it doesn't exist and marks the
previous day's note as "No entries recorded" when no notes were added.

```
node scripts/daily_fleeting_automation.js
```

## Jekyll Settings

Fleeting notes for future dates are enabled by the `future: true` setting in `_config.yml`.

## Maintenance

To ensure all fleeting notes display correctly:

1. Run `create_future_dates.js` periodically to ensure future date placeholders exist
2. Run `normalize_fleeting_dates.js` to fix any formatting issues
3. Use `check_fleeting_files.js` to verify all files are correct

These scripts should be run after adding new fleeting notes or when troubleshooting display issues. 