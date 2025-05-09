# Setting up Automated Fleeting Notes

This project uses GitHub Actions to automatically create fleeting notes at midnight and trigger a Netlify rebuild.

## Setting up the Netlify Build Hook

1. Go to your Netlify dashboard for this site
2. Navigate to Site settings → Build & deploy → Build hooks
3. Click "Add build hook"
4. Name it "Daily Fleeting Notes"
5. Select your main branch
6. Copy the URL that Netlify provides (it will look like `https://api.netlify.com/build_hooks/your-unique-id`)

## Adding the Secret to GitHub

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `NETLIFY_BUILD_HOOK`
5. Value: Paste the build hook URL you copied from Netlify
6. Click "Add secret"

## Testing the Workflow

1. Go to your repository on GitHub
2. Navigate to Actions → "Daily Fleeting Notes" workflow
3. Click "Run workflow" on the right side
4. Check the workflow logs to make sure it created files (if needed) and triggered Netlify

## How it Works

- The GitHub Action runs every day at midnight UTC
- It creates fleeting note files for today and the next 3 days if they don't exist yet
- If any new files are created, it commits them to the repository
- It then triggers a Netlify build to publish the changes

This ensures your fleeting notes are always up to date without requiring manual intervention. 