#!/bin/bash

# Goldium DeFi Deployment Script
# This script handles the complete deployment of the Goldium DeFi application

echo "🚀 Starting Goldium DeFi Deployment..."

# Set up Rust environment
source /usr/local/cargo/env

# Install Solana CLI if not present
if ! command -v solana &> /dev/null; then
    echo "📦 Installing Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.26/install)"
    export PATH="/home/ubuntu/.local/share/solana/install/active_release/bin:$PATH"
fi

# Install Anchor CLI if not present
if ! command -v anchor &> /dev/null; then
    echo "⚓ Installing Anchor CLI..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi

# Set Solana to mainnet
echo "🌐 Setting Solana to mainnet..."
solana config set --url mainnet-beta

# Check if wallet exists, if not create one
if [ ! -f ~/.config/solana/id.json ]; then
    echo "💰 Creating new Solana wallet..."
    solana-keygen new --outfile ~/.config/solana/id.json --no-bip39-passphrase
    echo "⚠️  IMPORTANT: Please fund this wallet with SOL for deployment!"
    solana address
    echo "💡 Send some SOL to this address before continuing..."
    read -p "Press Enter when wallet is funded..."
fi

# Check wallet balance
echo "💰 Checking wallet balance..."
solana balance

# Create GOLD token if not exists
echo "🪙 Creating GOLD token..."
GOLD_TOKEN_MINT=$(spl-token create-token --decimals 6 | grep "Creating token" | awk '{print $3}')
echo "GOLD Token Mint: $GOLD_TOKEN_MINT"

# Create token account and mint initial supply
echo "🏭 Minting initial GOLD token supply..."
spl-token create-account $GOLD_TOKEN_MINT
spl-token mint $GOLD_TOKEN_MINT 1000000000 # Mint 1 billion GOLD tokens

# Update environment file with actual token mint
echo "📝 Updating environment configuration..."
sed -i "s/NEXT_PUBLIC_GOLD_TOKEN_MINT=.*/NEXT_PUBLIC_GOLD_TOKEN_MINT=$GOLD_TOKEN_MINT/" .env.local

# Build and deploy staking contract
echo "🔨 Building staking contract..."
cd contracts/staking/anchor
anchor build

echo "🚀 Deploying staking contract..."
STAKING_PROGRAM_ID=$(anchor deploy | grep "Program Id" | awk '{print $3}')
echo "Staking Program ID: $STAKING_PROGRAM_ID"

# Update environment with program ID
cd /workspace
sed -i "s/NEXT_PUBLIC_STAKING_PROGRAM_ID=.*/NEXT_PUBLIC_STAKING_PROGRAM_ID=$STAKING_PROGRAM_ID/" .env.local

# Initialize staking pool
echo "🏊 Initializing staking pool..."
cd contracts/staking/anchor
anchor run initialize-pool

echo "✅ Deployment completed!"
echo "🌐 GOLD Token Mint: $GOLD_TOKEN_MINT"
echo "📋 Staking Program ID: $STAKING_PROGRAM_ID"
echo "🔗 Application URL: http://localhost:3000"

echo ""
echo "🎉 Goldium DeFi is now ready for mainnet operations!"
echo "📊 All transactions will be visible on Solscan"
echo "💰 Users can now stake real GOLD tokens and earn rewards"