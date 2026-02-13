# Deployment Instructions

This site is configured to automatically deploy to GitHub Pages using GitHub Actions.

## Initial Setup

To enable GitHub Pages for this repository, follow these steps:

1. Go to your repository on GitHub: `https://github.com/praveenreddy8942-debug/klmaterial`

2. Navigate to **Settings** → **Pages** (in the left sidebar)

3. Under **Source**, select:
   - Source: **GitHub Actions**

4. The site will automatically deploy when changes are pushed to the `main` branch

## Deployment Process

The deployment workflow (`.github/workflows/deploy.yml`) will:
- Trigger on every push to the `main` branch
- Can also be manually triggered via the Actions tab
- Deploy all files from the root directory to GitHub Pages
- Make the site available at: `https://praveenreddy8942-debug.github.io/klmaterial/`

## Manual Deployment

To manually trigger a deployment:
1. Go to the **Actions** tab in your GitHub repository
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow** button
4. Select the branch (usually `main`)
5. Click **Run workflow**

## Verifying Deployment

After the workflow completes:
1. Check the Actions tab for workflow status (should show green checkmark)
2. Visit your site at: `https://praveenreddy8942-debug.github.io/klmaterial/`
3. The deployment URL will also be shown in the workflow output

## Troubleshooting

If the site doesn't deploy:
- Verify GitHub Pages is enabled in repository Settings → Pages
- Check that the workflow ran successfully in the Actions tab
- Ensure the `main` branch has the latest changes
- Check that repository permissions include "pages: write"
