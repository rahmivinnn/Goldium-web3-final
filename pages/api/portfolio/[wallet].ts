import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { getUserByWallet } from '../../../lib/database';

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

const GOLD_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_GOLD_TOKEN_MINT || 'So11111111111111111111111111111111111111112'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { wallet } = req.query;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const walletPubkey = new PublicKey(wallet as string);
      
      // Get user data from database
      const user = await getUserByWallet(wallet as string);
      
      // Fetch live balances
      const [solBalance, goldBalance] = await Promise.all([
        connection.getBalance(walletPubkey).then(balance => balance / 1e9),
        getGoldBalance(walletPubkey)
      ]);

      // Calculate portfolio value (mock prices)
      const solPrice = 150; // Mock SOL price
      const goldPrice = 1.5; // Mock GOLD price
      
      const portfolioValue = (solBalance * solPrice) + (goldBalance * goldPrice);
      
      // Get staking data
      const stakingData = user?.stakingRecords.reduce((acc, record) => {
        if (record.isActive) {
          acc.totalStaked += record.amount;
          acc.estimatedRewards += calculateStakingRewards(record);
        }
        return acc;
      }, { totalStaked: 0, estimatedRewards: 0 }) || { totalStaked: 0, estimatedRewards: 0 };

      // Transaction analytics
      const transactionStats = user?.transactions.reduce((acc, tx) => {
        acc.totalTransactions++;
        if (tx.status === 'confirmed') acc.successfulTransactions++;
        acc.totalVolume += tx.amount;
        acc.totalFees += tx.fee;
        return acc;
      }, {
        totalTransactions: 0,
        successfulTransactions: 0,
        totalVolume: 0,
        totalFees: 0
      }) || {
        totalTransactions: 0,
        successfulTransactions: 0,
        totalVolume: 0,
        totalFees: 0
      };

      // Portfolio breakdown
      const portfolio = {
        total: {
          value: portfolioValue,
          change24h: 5.2, // Mock 24h change
          changePercent: 3.4
        },
        assets: [
          {
            symbol: 'SOL',
            name: 'Solana',
            balance: solBalance,
            value: solBalance * solPrice,
            price: solPrice,
            change24h: 2.1,
            percentage: ((solBalance * solPrice) / portfolioValue) * 100
          },
          {
            symbol: 'GOLD',
            name: 'Goldium Token',
            balance: goldBalance,
            value: goldBalance * goldPrice,
            price: goldPrice,
            change24h: 8.5,
            percentage: ((goldBalance * goldPrice) / portfolioValue) * 100
          }
        ],
        staking: {
          totalStaked: stakingData.totalStaked,
          estimatedRewards: stakingData.estimatedRewards,
          value: stakingData.totalStaked * goldPrice
        },
        analytics: {
          ...transactionStats,
          successRate: transactionStats.totalTransactions > 0 ? 
            (transactionStats.successfulTransactions / transactionStats.totalTransactions) * 100 : 0,
          averageFee: transactionStats.totalTransactions > 0 ?
            transactionStats.totalFees / transactionStats.totalTransactions : 0
        }
      };

      res.status(200).json({
        wallet: wallet as string,
        portfolio,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Portfolio API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch portfolio data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getGoldBalance(walletAddress: PublicKey): Promise<number> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, walletAddress);
    const accountInfo = await getAccount(connection, tokenAccount);
    return Number(accountInfo.amount) / 1e6; // Assuming 6 decimals
  } catch (error) {
    return 0; // Token account doesn't exist
  }
}

function calculateStakingRewards(stakingRecord: any): number {
  const now = new Date();
  const stakingTime = new Date(stakingRecord.stakingTime);
  const daysStaked = (now.getTime() - stakingTime.getTime()) / (1000 * 60 * 60 * 24);
  
  const annualReward = (stakingRecord.amount * stakingRecord.apy) / 100;
  const dailyReward = annualReward / 365;
  
  return Math.max(0, dailyReward * daysStaked - stakingRecord.rewardsClaimed);
}