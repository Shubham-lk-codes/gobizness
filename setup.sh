#!/bin/bash

# TOP DESIGN - GitHub Repository Setup Script
# Run this after creating your GitHub repository

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         TOP DESIGN - GitHub Setup                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git branch -M main
fi

# Check for remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "🔗 Please add your GitHub repository URL:"
    echo "   Example: https://github.com/YOUR_USERNAME/topdesign-website.git"
    read -p "Repository URL: " repo_url
    git remote add origin $repo_url
fi

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Build assets
echo ""
echo "🔨 Building assets..."
npm run build

# Initial commit
echo ""
echo "💾 Creating initial commit..."
git add .
git commit -m "feat: initial TOP DESIGN website setup

- Complete website with 6 services
- Portfolio, testimonials, blog sections
- Enquiry popup form
- Admin panel with dashboard
- Express.js server with API endpoints
- Docker support
- CI/CD with GitHub Actions
- Deploy configs for Vercel, Netlify, AWS"

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Go to your GitHub repository"
echo "  2. Navigate to Settings → Pages"
echo "  3. Select 'GitHub Actions' as source"
echo "  4. Your site will be live at: https://YOUR_USERNAME.github.io/topdesign-website"
echo ""
echo "For custom domain (www.topdesign.co.in):"
echo "  1. Add CNAME file with 'www.topdesign.co.in'"
echo "  2. Configure DNS: CNAME record → YOUR_USERNAME.github.io"
echo "  3. Enable HTTPS in GitHub Pages settings"
echo ""
