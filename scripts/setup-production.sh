#!/bin/bash

# Goldium DeFi - Complete Production Setup Script
echo "🚀 Setting up Goldium DeFi for production deployment..."

# Create necessary directories
mkdir -p keypairs
mkdir -p public/nft
mkdir -p logs

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Generate production environment file
echo "📝 Creating production environment configuration..."
cat > .env.production << EOF
# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com

# Jupiter API Configuration
NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag/v6

# Metaplex Configuration
NEXT_PUBLIC_METAPLEX_RPC_URL=https://api.mainnet-beta.solana.com

# Database Configuration (will be set in Vercel)
DATABASE_URL=\$DATABASE_URL

# Authentication
JWT_SECRET=\$JWT_SECRET

# These will be updated after token/contract deployment
NEXT_PUBLIC_GOLD_TOKEN_MINT=\$NEXT_PUBLIC_GOLD_TOKEN_MINT
NEXT_PUBLIC_STAKING_PROGRAM_ID=\$NEXT_PUBLIC_STAKING_PROGRAM_ID
EOF

# Create Vercel project configuration
echo "⚙️ Creating Vercel project configuration..."
cat > vercel.json << EOF
{
  "name": "goldium-defi",
  "version": 2,
  "env": {
    "NEXT_PUBLIC_SOLANA_NETWORK": "mainnet-beta",
    "NEXT_PUBLIC_RPC_URL": "https://api.mainnet-beta.solana.com",
    "NEXT_PUBLIC_JUPITER_API_URL": "https://quote-api.jup.ag/v6",
    "NEXT_PUBLIC_METAPLEX_RPC_URL": "https://api.mainnet-beta.solana.com"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database_url",
      "JWT_SECRET": "@jwt_secret",
      "NEXT_PUBLIC_GOLD_TOKEN_MINT": "@gold_token_mint",
      "NEXT_PUBLIC_STAKING_PROGRAM_ID": "@staking_program_id"
    }
  },
  "functions": {
    "pages/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "redirects": [
    {
      "source": "/solscan",
      "destination": "/dashboard",
      "permanent": false
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
EOF

# Create GitHub repository setup
echo "📁 Setting up Git repository..."
git init
git add .
git commit -m "Initial commit: Complete Goldium DeFi fullstack application

Features:
- ✅ Splashscreen with K1-K8 characters
- ✅ Complete Solscan tracking for all transactions
- ✅ Fullstack backend with Prisma database
- ✅ Real Jupiter swap integration
- ✅ Smart contract staking system
- ✅ NFT reward system
- ✅ Portfolio tracking and analytics
- ✅ Auto-deployment to Vercel
- ✅ Production-ready with CI/CD"

# Setup Vercel project
echo "🌐 Setting up Vercel project..."
vercel --yes

# Get project details
PROJECT_ID=$(vercel ls | head -2 | tail -1 | awk '{print $1}')
echo "📋 Vercel Project ID: $PROJECT_ID"

echo ""
echo "🎉 Production setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main"
echo "2. Set up Vercel Postgres database in dashboard"
echo "3. Set environment variables in Vercel dashboard:"
echo "   - DATABASE_URL (from Vercel Postgres)"
echo "   - JWT_SECRET (generate secure key)"
echo "   - NEXT_PUBLIC_GOLD_TOKEN_MINT (after token creation)"
echo "   - NEXT_PUBLIC_STAKING_PROGRAM_ID (after contract deployment)"
echo ""
echo "4. Deploy: vercel --prod"
echo ""
echo "🌟 Your Goldium DeFi app will be live at: https://goldium-defi.vercel.app"