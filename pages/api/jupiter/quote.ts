import { NextApiRequest, NextApiResponse } from 'next';

const JUPITER_API_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL || 'https://quote-api.jup.ag/v6';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { inputMint, outputMint, amount, slippageBps = 50 } = req.query;
      
      if (!inputMint || !outputMint || !amount) {
        return res.status(400).json({ 
          error: 'Missing required parameters: inputMint, outputMint, amount' 
        });
      }

      const params = new URLSearchParams({
        inputMint: inputMint as string,
        outputMint: outputMint as string,
        amount: amount as string,
        slippageBps: slippageBps as string,
      });

      const response = await fetch(`${JUPITER_API_URL}/quote?${params}`);
      
      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.statusText}`);
      }

      const quote = await response.json();
      
      // Add additional metadata
      const enhancedQuote = {
        ...quote,
        timestamp: Date.now(),
        source: 'jupiter',
        network: 'mainnet-beta'
      };

      res.status(200).json(enhancedQuote);
    } catch (error) {
      console.error('Error getting Jupiter quote:', error);
      res.status(500).json({ 
        error: 'Failed to get quote from Jupiter',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}