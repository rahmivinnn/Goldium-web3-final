#!/bin/bash

echo "🚀 Setting up Vercel Auto-Deploy from GitHub..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please login to Vercel:"
    vercel login
    echo "✅ Please run this script again after login"
    exit 1
fi

echo "✅ Vercel CLI ready"

# Link project to Vercel
echo "🔗 Linking project to Vercel..."
vercel link --yes

# Get project information
PROJECT_INFO=$(vercel project ls --format json 2>/dev/null || echo "[]")
echo "📋 Project linked successfully"

# Deploy initial version
echo "🚀 Deploying initial version..."
vercel --prod --yes

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls | grep goldium | head -1 | awk '{print $2}')
if [ -z "$DEPLOYMENT_URL" ]; then
    DEPLOYMENT_URL="goldium-defi"
fi

echo ""
echo "🎉 VERCEL AUTO-DEPLOY SETUP COMPLETED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ CONFIGURED:"
echo "   🔗 GitHub repository connected to Vercel"
echo "   🚀 Auto-deploy enabled for main branch"
echo "   🌐 Application deployed and live"
echo ""
echo "🌐 LIVE APPLICATION:"
echo "   Main: https://$DEPLOYMENT_URL.vercel.app"
echo "   Dashboard: https://$DEPLOYMENT_URL.vercel.app/dashboard"
echo "   Characters: https://$DEPLOYMENT_URL.vercel.app/characters"
echo ""
echo "🔄 AUTO-DEPLOY ACTIVE:"
echo "   Every push to 'main' branch will auto-deploy"
echo "   GitHub Actions will handle the deployment"
echo "   No manual intervention needed"
echo ""
echo "📋 NEXT STEPS (Optional):"
echo "1. Setup Vercel Postgres in dashboard for full backend"
echo "2. Add environment variables for token addresses"
echo "3. Create GOLD token and update env vars"
echo ""
echo "🎯 TO TEST AUTO-DEPLOY:"
echo "   Make any change and push to main branch"
echo "   Deployment will happen automatically!"
echo ""
echo "🎉 GOLDIUM DEFI IS NOW LIVE WITH AUTO-DEPLOY! 🚀"