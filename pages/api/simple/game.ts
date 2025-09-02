import { NextApiRequest, NextApiResponse } from 'next';
import { PublicKey } from '@solana/web3.js';
import { recordGameResult, createTransaction } from '../../../lib/simple-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { 
        walletAddress,
        score,
        totalQuestions,
        timeSpent,
        category = 'mixed'
      } = req.body;
      
      if (!walletAddress || score === undefined || !totalQuestions || !timeSpent) {
        return res.status(400).json({ 
          error: 'Missing required parameters: walletAddress, score, totalQuestions, timeSpent' 
        });
      }

      // Verify wallet address
      try {
        new PublicKey(walletAddress);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }

      // Record game result and calculate rewards
      const { rewardAmount, nftEligible } = await recordGameResult(
        walletAddress,
        score,
        totalQuestions,
        timeSpent
      );

      // Create reward transaction if earned
      let rewardSignature = null;
      if (rewardAmount > 0) {
        rewardSignature = `game_reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        await createTransaction({
          signature: rewardSignature,
          type: 'claim',
          amount: rewardAmount,
          token: 'GOLD',
          fromAddress: 'Goldium Game System',
          toAddress: walletAddress,
          status: 'confirmed',
          walletAddress
        });
      }

      const scorePercentage = (score / totalQuestions) * 100;

      res.status(200).json({
        success: true,
        gameResult: {
          score,
          totalQuestions,
          scorePercentage: Math.round(scorePercentage),
          timeSpent,
          category
        },
        reward: {
          amount: rewardAmount,
          nftEligible,
          signature: rewardSignature,
          solscanUrl: rewardSignature ? `https://solscan.io/tx/${rewardSignature}` : null
        },
        achievements: {
          perfectScore: scorePercentage === 100,
          excellentScore: scorePercentage >= 80,
          speedBonus: timeSpent < totalQuestions * 10,
          firstTime: false // Simplified for demo
        }
      });
    } catch (error) {
      console.error('Game score submission error:', error);
      res.status(500).json({ 
        error: 'Failed to submit game score',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}