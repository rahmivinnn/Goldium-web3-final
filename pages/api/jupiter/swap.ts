import { NextApiRequest, NextApiResponse } from 'next';

const JUPITER_API_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL || 'https://quote-api.jup.ag/v6';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userPublicKey, quoteResponse, prioritizationFeeLamports } = req.body;
      
      if (!userPublicKey || !quoteResponse) {
        return res.status(400).json({ 
          error: 'Missing required parameters: userPublicKey, quoteResponse' 
        });
      }

      const swapRequest = {
        userPublicKey,
        quoteResponse,
        prioritizationFeeLamports: prioritizationFeeLamports || 0,
        asLegacyTransaction: false, // Use versioned transactions
        useSharedAccounts: true,
        dynamicComputeUnitLimit: true
      };

      const response = await fetch(`${JUPITER_API_URL}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swapRequest),
      });

      if (!response.ok) {
        throw new Error(`Jupiter swap API error: ${response.statusText}`);
      }

      const swapData = await response.json();
      
      // Add metadata
      const enhancedSwapData = {
        ...swapData,
        timestamp: Date.now(),
        network: 'mainnet-beta',
        source: 'jupiter'
      };

      res.status(200).json(enhancedSwapData);
    } catch (error) {
      console.error('Error getting Jupiter swap transaction:', error);
      res.status(500).json({ 
        error: 'Failed to get swap transaction from Jupiter',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}