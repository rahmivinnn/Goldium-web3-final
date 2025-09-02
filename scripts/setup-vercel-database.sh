#!/bin/bash

echo "🗄️ Setting up Vercel Database and Environment Variables..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please login to Vercel first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Vercel CLI ready"

# Link project if not already linked
echo "🔗 Linking Vercel project..."
vercel link --yes

# Set up environment variables for production
echo "🔧 Setting up environment variables..."

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "🔑 Generated JWT secret: ${JWT_SECRET:0:20}..."

# Set environment variables
echo "📝 Setting production environment variables..."

# Core Solana configuration
vercel env add NEXT_PUBLIC_SOLANA_NETWORK production --value "mainnet-beta"
vercel env add NEXT_PUBLIC_RPC_URL production --value "https://api.mainnet-beta.solana.com"
vercel env add NEXT_PUBLIC_JUPITER_API_URL production --value "https://quote-api.jup.ag/v6"
vercel env add NEXT_PUBLIC_METAPLEX_RPC_URL production --value "https://api.mainnet-beta.solana.com"

# Authentication
vercel env add JWT_SECRET production --value "$JWT_SECRET"

# Placeholder for token addresses (will be updated after token creation)
vercel env add NEXT_PUBLIC_GOLD_TOKEN_MINT production --value "So11111111111111111111111111111111111111112"
vercel env add NEXT_PUBLIC_STAKING_PROGRAM_ID production --value "YourStakingProgramIdHere"

echo "✅ Environment variables set"

# Create Vercel Postgres database
echo "🗄️ Setting up Vercel Postgres database..."
echo ""
echo "📋 MANUAL STEPS REQUIRED:"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Select your 'goldium-defi' project"
echo "3. Go to 'Storage' tab"
echo "4. Click 'Create Database'"
echo "5. Select 'Postgres'"
echo "6. Choose a database name (e.g., 'goldium-db')"
echo "7. Select region closest to your users"
echo "8. Click 'Create'"
echo ""
echo "9. After database is created:"
echo "   - Copy the DATABASE_URL connection string"
echo "   - Go to Settings → Environment Variables"
echo "   - Add DATABASE_URL with the connection string"
echo ""

# Wait for user confirmation
read -p "Press Enter after you've set up the Vercel Postgres database and DATABASE_URL..."

# Test deployment
echo "🚀 Testing deployment with database..."
vercel --prod

echo ""
echo "🎉 VERCEL SETUP COMPLETED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ CONFIGURED:"
echo "   🔗 Vercel project linked"
echo "   🔧 Environment variables set"
echo "   🗄️ Database configuration ready"
echo "   🚀 Production deployment ready"
echo ""
echo "🌐 Your app should now be live at:"
echo "   https://goldium-defi.vercel.app"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Visit your live app to test all features"
echo "2. Create GOLD token: npm run create-token"
echo "3. Deploy staking contracts: npm run deploy"
echo "4. Update token addresses in Vercel environment variables"
echo ""
echo "🎯 COMPLETE FULLSTACK DEFI APPLICATION IS NOW LIVE! 🎉"