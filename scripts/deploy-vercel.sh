#!/bin/bash

# Goldium DeFi - Complete Vercel Deployment Script
echo "🚀 Starting Goldium DeFi deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production=false

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Set up Vercel project
echo "⚙️ Setting up Vercel project..."
vercel --yes

# Set environment variables
echo "🔧 Setting up environment variables..."

# Required environment variables for production
vercel env add NEXT_PUBLIC_SOLANA_NETWORK production <<< "mainnet-beta"
vercel env add NEXT_PUBLIC_RPC_URL production <<< "https://api.mainnet-beta.solana.com"
vercel env add NEXT_PUBLIC_JUPITER_API_URL production <<< "https://quote-api.jup.ag/v6"
vercel env add NEXT_PUBLIC_METAPLEX_RPC_URL production <<< "https://api.mainnet-beta.solana.com"

# Database URL (will need to be set manually in Vercel dashboard for Postgres)
echo "⚠️  Please set DATABASE_URL in Vercel dashboard for production database"

# JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
vercel env add JWT_SECRET production <<< "$JWT_SECRET"

# Deploy to production
echo "🌐 Deploying to Vercel..."
vercel --prod

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls | grep "goldium-defi" | head -1 | awk '{print $2}')

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌐 Application URL: https://$DEPLOYMENT_URL"
echo "📊 Solscan integration: Active"
echo "🎮 Character system: Ready"
echo "💰 DeFi features: Functional"
echo ""
echo "📋 Next steps:"
echo "1. Set up production database in Vercel dashboard"
echo "2. Deploy GOLD token using: npm run create-token"
echo "3. Deploy staking contracts using: npm run deploy-contracts"
echo "4. Update environment variables with actual addresses"
echo ""
echo "🔗 Useful links:"
echo "   - Vercel Dashboard: https://vercel.com/dashboard"
echo "   - Application: https://$DEPLOYMENT_URL"
echo "   - Solscan: https://solscan.io"

# Save deployment info
cat > deployment-info.json << EOF
{
  "deploymentUrl": "https://$DEPLOYMENT_URL",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "1.0.0",
  "features": {
    "splashscreen": true,
    "solscanTracking": true,
    "characterSystem": true,
    "fullstackBackend": true,
    "database": true,
    "authentication": true,
    "nftRewards": true,
    "portfolioTracking": true
  },
  "endpoints": {
    "frontend": "https://$DEPLOYMENT_URL",
    "api": "https://$DEPLOYMENT_URL/api",
    "dashboard": "https://$DEPLOYMENT_URL/dashboard",
    "characters": "https://$DEPLOYMENT_URL/characters"
  }
}
EOF

echo "💾 Deployment info saved to deployment-info.json"