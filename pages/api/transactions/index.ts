import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { wallet, limit = 10 } = req.query;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const walletPubkey = new PublicKey(wallet as string);
      
      // Fetch transaction signatures
      const signatures = await connection.getSignaturesForAddress(
        walletPubkey,
        { limit: parseInt(limit as string) }
      );

      // Get detailed transaction information
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            });
            
            return {
              signature: sig.signature,
              slot: sig.slot,
              timestamp: sig.blockTime,
              status: sig.confirmationStatus,
              fee: tx?.meta?.fee || 0,
              success: !sig.err,
              accounts: tx?.transaction.message.getAccountKeys().map(key => key.toString()) || []
            };
          } catch (error) {
            console.error(`Error fetching transaction ${sig.signature}:`, error);
            return {
              signature: sig.signature,
              slot: sig.slot,
              timestamp: sig.blockTime,
              status: sig.confirmationStatus,
              fee: 0,
              success: !sig.err,
              accounts: []
            };
          }
        })
      );

      res.status(200).json({ transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}