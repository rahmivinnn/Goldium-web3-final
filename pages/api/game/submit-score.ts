import { NextApiRequest, NextApiResponse } from 'next';
import { PublicKey } from '@solana/web3.js';
import { createGameResult, createOrUpdateUser, createTransaction } from '../../../lib/database';

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

      // Create or update user
      const user = await createOrUpdateUser(walletAddress);

      // Calculate reward based on score
      const scorePercentage = (score / totalQuestions) * 100;
      let rewardAmount = 0;
      let nftReward = false;

      if (scorePercentage >= 90) {
        rewardAmount = 100; // 100 GOLD for perfect score
        nftReward = true;
      } else if (scorePercentage >= 80) {
        rewardAmount = 50; // 50 GOLD for excellent score
      } else if (scorePercentage >= 60) {
        rewardAmount = 25; // 25 GOLD for good score
      } else if (scorePercentage >= 40) {
        rewardAmount = 10; // 10 GOLD for passing score
      }

      // Create game result record
      const gameResult = await createGameResult({
        score,
        totalQuestions,
        timeSpent,
        category,
        rewardAmount,
        userId: user.id
      });

      // Create mock transaction for reward (in real implementation, this would be actual transaction)
      const mockSignature = `game_reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      if (rewardAmount > 0) {
        await createTransaction({
          signature: mockSignature,
          type: 'claim',
          amount: rewardAmount,
          token: 'GOLD',
          toAddress: walletAddress,
          status: 'confirmed',
          userId: user.id
        });
      }

      res.status(200).json({
        success: true,
        gameResult: {
          id: gameResult.id,
          score,
          totalQuestions,
          scorePercentage: Math.round(scorePercentage),
          timeSpent,
          category
        },
        reward: {
          amount: rewardAmount,
          nftEligible: nftReward,
          signature: rewardAmount > 0 ? mockSignature : null,
          solscanUrl: rewardAmount > 0 ? `https://solscan.io/tx/${mockSignature}` : null
        },
        achievements: {
          perfectScore: scorePercentage === 100,
          excellentScore: scorePercentage >= 80,
          speedBonus: timeSpent < totalQuestions * 10, // Less than 10 seconds per question
          firstTime: user.gamesPlayed === 0
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