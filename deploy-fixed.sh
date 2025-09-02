#!/bin/bash

echo "🚀 DEPLOYING GOLDIUM DEFI TO VERCEL (FIXED VERSION)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please login to Vercel first:"
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Setting up database client..."
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
scripts/
deploy-*.sh
deploy-*.js
EOF

# Update Prisma schema for production (use PostgreSQL)
cat > prisma/schema.prisma << EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  walletAddress String   @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  totalTransactions Int @default(0)
  totalVolume       Float @default(0)
  gameScore         Int @default(0)
  gamesPlayed       Int @default(0)
  nftRewards        Int @default(0)
  lessonsCompleted  Int @default(0)
  
  transactions Transaction[]
  stakingRecords StakingRecord[]
  gameResults GameResult[]
  
  @@map("users")
}

model Transaction {
  id          String   @id @default(cuid())
  signature   String   @unique
  type        String
  amount      Float
  token       String
  fromAddress String?
  toAddress   String?
  status      String
  fee         Float    @default(0)
  slot        Int?
  blockTime   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  @@map("transactions")
}

model StakingRecord {
  id            String   @id @default(cuid())
  userAddress   String
  amount        Float
  stakingTime   DateTime
  unstakingTime DateTime?
  rewardsClaimed Float   @default(0)
  isActive      Boolean  @default(true)
  apy           Float
  lockPeriod    Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  @@map("staking_records")
}

model GameResult {
  id          String   @id @default(cuid())
  score       Int
  totalQuestions Int
  timeSpent   Int
  category    String
  rewardClaimed Boolean @default(false)
  rewardAmount Float   @default(0)
  nftMinted   Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  userId String
  user   User   @relation(fields: [userId], references: [id])
  
  @@map("game_results")
}

model TokenPrice {
  id        String   @id @default(cuid())
  tokenMint String   @unique
  symbol    String
  price     Float
  change24h Float    @default(0)
  volume24h Float    @default(0)
  updatedAt DateTime @updatedAt
  
  @@map("token_prices")
}

model StakingPool {
  id          String   @id @default(cuid())
  poolId      Int      @unique
  totalStaked Float    @default(0)
  apy         Float
  lockPeriod  Int
  totalRewards Float   @default(0)
  isActive    Boolean  @default(true)
  contractAddress String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("staking_pools")
}
EOF

echo "🗄️ Updated Prisma schema for PostgreSQL"

# Generate client again for PostgreSQL
npx prisma generate

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod --yes

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --scope=personal | grep goldium | head -1 | awk '{print $2}')

if [ -z "$DEPLOYMENT_URL" ]; then
    DEPLOYMENT_URL="goldium-defi.vercel.app"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Application URL: https://$DEPLOYMENT_URL"
echo ""
echo "📋 IMPORTANT: Setup Database"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Select 'goldium-defi' project"
echo "3. Go to 'Storage' tab"
echo "4. Click 'Create Database' → 'Postgres'"
echo "5. After creation, go to Settings → Environment Variables"
echo "6. Add DATABASE_URL with the Postgres connection string"
echo "7. Redeploy: vercel --prod"
echo ""
echo "✅ FEATURES DEPLOYED:"
echo "   🎬 Splashscreen with K1-K8 characters"
echo "   📊 Complete Solscan tracking"
echo "   💰 Real Solana mainnet DeFi operations"
echo "   🎮 Educational game with NFT rewards"
echo "   📈 Portfolio analytics"
echo "   🗄️ Fullstack backend with APIs"
echo ""
echo "🎯 After database setup, your app will be fully functional!"