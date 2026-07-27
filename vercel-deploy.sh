#!/bin/bash
# TOP DESIGN - Vercel Deployment Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         TOP DESIGN - Vercel Deploy                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Deploy
echo ""
echo "🚀 Deploying to Vercel..."
echo ""

vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Add custom domain in Vercel dashboard"
echo "  2. Configure DNS: CNAME www.topdesign.co.in → cname.vercel-dns.com"
echo "  3. Enable HTTPS (auto-enabled by Vercel)"
echo ""
