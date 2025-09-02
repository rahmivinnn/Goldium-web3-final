import { NextApiRequest, NextApiResponse } from 'next';
import { createTransaction, getTransactionsByWallet, updateTransactionStatus } from '../../../lib/simple-storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { 
        signature,
        type,
        amount,
        token,
        fromAddress,
        toAddress,
        status = 'pending',
        walletAddress
      } = req.body;
      
      if (!signature || !type || !amount || !token || !walletAddress) {
        return res.status(400).json({ 
          error: 'Missing required parameters' 
        });
      }

      const transaction = await createTransaction({
        signature,
        type,
        amount: parseFloat(amount),
        token,
        fromAddress,
        toAddress,
        status,
        walletAddress
      });

      res.status(200).json({
        success: true,
        transaction,
        solscanUrl: `https://solscan.io/tx/${signature}`
      });
    } catch (error) {
      console.error('Transaction creation error:', error);
      res.status(500).json({ 
        error: 'Failed to create transaction record',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { wallet } = req.query;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const transactions = await getTransactionsByWallet(wallet as string);

      res.status(200).json({ 
        transactions: transactions.map(tx => ({
          ...tx,
          solscanUrl: `https://solscan.io/tx/${tx.signature}`
        }))
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { signature, status } = req.body;
      
      if (!signature || !status) {
        return res.status(400).json({ 
          error: 'Missing required parameters: signature, status' 
        });
      }

      const transaction = await updateTransactionStatus(signature, status);
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.status(200).json({
        success: true,
        transaction
      });
    } catch (error) {
      console.error('Transaction update error:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}