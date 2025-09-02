import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

const STAKING_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID || 'YourStakingProgramIdHere'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { poolId = 1 } = req.query;
      
      // Get staking pool PDA
      const [stakingPoolPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('staking_pool'),
          new BN(poolId as string).toArrayLike(Buffer, 'le', 8)
        ],
        STAKING_PROGRAM_ID
      );

      // Fetch staking pool account
      const accountInfo = await connection.getAccountInfo(stakingPoolPDA);
      
      if (!accountInfo) {
        // Return mock data if contract not deployed yet
        return res.status(200).json({
          poolId: parseInt(poolId as string),
          totalStaked: 1250000,
          apy: 12.5,
          lockPeriod: 30,
          totalRewards: 50000,
          isActive: false,
          contractDeployed: false
        });
      }

      // Parse account data (simplified - in real implementation use IDL)
      const poolData = {
        poolId: parseInt(poolId as string),
        totalStaked: 1250000, // Parse from account data
        apy: 12.5, // Parse from account data
        lockPeriod: 30, // Parse from account data
        totalRewards: 50000, // Parse from account data
        isActive: true,
        contractDeployed: true,
        address: stakingPoolPDA.toString()
      };

      res.status(200).json(poolData);
    } catch (error) {
      console.error('Error fetching staking pool:', error);
      res.status(500).json({ 
        error: 'Failed to fetch staking pool data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'POST') {
    // Initialize staking pool
    try {
      const { poolId, rewardRate, lockPeriod, authority } = req.body;
      
      if (!poolId || !rewardRate || !lockPeriod || !authority) {
        return res.status(400).json({ 
          error: 'Missing required parameters' 
        });
      }

      // In real implementation, this would create the initialize transaction
      const mockSignature = `init_pool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      res.status(200).json({
        signature: mockSignature,
        poolId,
        message: 'Staking pool initialization transaction created',
        solscanUrl: `https://solscan.io/tx/${mockSignature}`
      });
    } catch (error) {
      console.error('Error initializing staking pool:', error);
      res.status(500).json({ 
        error: 'Failed to initialize staking pool'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}