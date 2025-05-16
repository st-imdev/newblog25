# GitHub Actions Workflow for Daily Fleeting Notes

This directory contains GitHub Actions workflows that automate tasks for this blog.

## `daily-fleeting-notes.yml` Workflow

This workflow automatically:

1. Creates a new fleeting note for the current day (if one doesn't exist)
2. Commits and pushes the new file to the repository
3. Triggers a Netlify build to deploy the updated site

### How It Works

1. **Scheduled Execution**: The workflow runs automatically at 6:00 AM UTC every day
2. **Manual Triggering**: You can also trigger it manually from the GitHub Actions tab
3. **File Creation**: Creates a properly formatted fleeting note with the correct date format
4. **Git Operations**: Commits and pushes the new file to the repository
5. **Netlify Deploy**: Triggers your Netlify build hook to update the site

### Advantages Over Local Automation

- Runs reliably on GitHub's servers regardless of your computer's status
- No need for your laptop to be on or running
- No need to set up cron jobs or launchd agents
- Logging and error tracking through GitHub Actions interface
- Can be manually triggered if needed

### Monitoring

You can monitor the workflow's execution in the "Actions" tab of your GitHub repository. Each run will show:

- Whether it succeeded or failed
- What actions were taken (create a new note, skip if exists)
- Any errors that occurred

### Customization

If you need to modify the workflow:

1. Edit the `.github/workflows/daily-fleeting-notes.yml` file
2. Adjust the cron schedule (`cron: '0 6 * * *'`) to run at a different time
3. Modify the note template if desired
4. Commit and push your changes 