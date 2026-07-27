#!/bin/bash
# Quick deploy to GitHub Pages

echo "Deploying TOP DESIGN to GitHub..."

# Ensure we're on main branch
git checkout main

# Add all files
git add .

# Commit with timestamp
git commit -m "deploy: update website $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
git push origin main

echo "✅ Pushed to GitHub!"
echo "🔄 GitHub Actions will auto-deploy in ~2 minutes"
echo "📊 Check progress at: https://github.com/$(git remote get-url origin | sed 's/.*github.com\///' | sed 's/\.git$//')/actions"
