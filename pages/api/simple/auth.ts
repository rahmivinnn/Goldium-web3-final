import { NextApiRequest, NextApiResponse } from 'next';
import { PublicKey } from '@solana/web3.js';
import jwt from 'jsonwebtoken';
import { createOrUpdateUser, getUserByWallet } from '../../../lib/simple-storage';

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-for-goldium-defi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ 
          error: 'Missing required parameter: walletAddress' 
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
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          walletAddress: user.walletAddress 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ 
        error: 'Authentication failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { walletAddress } = req.query;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const user = await getUserByWallet(walletAddress as string);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}