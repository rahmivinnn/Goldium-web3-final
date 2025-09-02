import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByWallet, getUserAnalytics } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { wallet } = req.query;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const user = await getUserByWallet(wallet as string);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const analytics = await getUserAnalytics(user.id);
      
      // Calculate additional metrics
      const recentTransactions = user.transactions.slice(0, 10);
      const stakingData = user.stakingRecords.reduce((acc, record) => {
        acc.totalStaked += record.amount;
        acc.totalRewards += record.rewardsClaimed;
        return acc;
      }, { totalStaked: 0, totalRewards: 0 });

      const gameStats = user.gameResults.reduce((acc, result) => {
        acc.totalScore += result.score;
        acc.totalRewards += result.rewardAmount;
        return acc;
      }, { totalScore: 0, totalRewards: 0 });

      res.status(200).json({
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          memberSince: user.createdAt
        },
        analytics: {
          ...analytics,
          staking: stakingData,
          gaming: {
            ...gameStats,
            averageScore: user.gameResults.length > 0 ? gameStats.totalScore / user.gameResults.length : 0,
            gamesPlayed: user.gamesPlayed,
            nftRewards: user.nftRewards
          }
        },
        recentActivity: recentTransactions.map(tx => ({
          signature: tx.signature,
          type: tx.type,
          amount: tx.amount,
          token: tx.token,
          status: tx.status,
          timestamp: tx.createdAt,
          solscanUrl: `https://solscan.io/tx/${tx.signature}`
        }))
      });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      res.status(500).json({ 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}