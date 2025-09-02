import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { createStakingRecord, createTransaction, createOrUpdateUser } from '../../../lib/database';

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { 
        walletAddress, 
        amount, 
        signature,
        apy = 12.5,
        lockPeriod = 30 
      } = req.body;
      
      if (!walletAddress || !amount || !signature) {
        return res.status(400).json({ 
          error: 'Missing required parameters: walletAddress, amount, signature' 
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

      // Create staking record
      const stakingRecord = await createStakingRecord({
        userAddress: walletAddress,
        amount: parseFloat(amount),
        apy,
        lockPeriod,
        userId: user.id
      });

      // Create transaction record
      await createTransaction({
        signature,
        type: 'stake',
        amount: parseFloat(amount),
        token: 'GOLD',
        fromAddress: walletAddress,
        status: 'pending',
        userId: user.id
      });

      res.status(200).json({
        success: true,
        stakingRecord: {
          id: stakingRecord.id,
          amount: stakingRecord.amount,
          apy: stakingRecord.apy,
          lockPeriod: stakingRecord.lockPeriod,
          stakingTime: stakingRecord.stakingTime
        },
        transaction: {
          signature,
          solscanUrl: `https://solscan.io/tx/${signature}`
        }
      });
    } catch (error) {
      console.error('Staking API error:', error);
      res.status(500).json({ 
        error: 'Failed to process staking request',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}