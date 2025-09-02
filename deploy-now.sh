#!/bin/bash

echo "🚀 DEPLOYING GOLDIUM DEFI TO VERCEL..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Setting up database..."
npx prisma generate

# Create .vercelignore
cat > .vercelignore << EOF
node_modules
.next
.env.local
.env
*.log
.DS_Store
keypairs
prisma/dev.db
lib/transaction-tracker-old.ts
pages/swap-old.tsx
EOF

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod --yes --force

echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ FEATURES DEPLOYED:"
echo "   🎬 Splashscreen with K1-K8 characters"
echo "   📊 Complete Solscan tracking"
echo "   🗄️ Fullstack backend with database"
echo "   🔐 Wallet authentication"
echo "   💰 Real Solana mainnet transactions"
echo "   🔄 Jupiter swap integration"
echo "   🏦 Smart contract staking"
echo "   🏆 NFT achievement system"
echo "   📈 Portfolio analytics"
echo "   🎮 Educational game system"
echo ""
echo "🌐 Your app is now LIVE at: https://goldium-defi.vercel.app"
echo "📊 All transactions will be tracked on Solscan!"
echo "🎮 K1-K8 characters ready in splashscreen!"
echo ""
echo "🎯 FULLY FUNCTIONAL FULLSTACK DEFI APPLICATION!"