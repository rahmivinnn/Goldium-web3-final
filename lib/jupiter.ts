import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { connection } from './solana';

// Jupiter API configuration
const JUPITER_API_URL = process.env.NEXT_PUBLIC_JUPITER_API_URL || 'https://quote-api.jup.ag/v6';

// Token mint addresses
export const TOKEN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112', // Wrapped SOL
  GOLD: process.env.NEXT_PUBLIC_GOLD_TOKEN_MINT || 'So11111111111111111111111111111111111111112', // Placeholder
};

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: any;
  priceImpactPct: string;
  routePlan: any[];
}

export interface SwapRequest {
  userPublicKey: string;
  quoteResponse: QuoteResponse;
  prioritizationFeeLamports?: number;
}

// Get quote from Jupiter
export const getJupiterQuote = async (
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<QuoteResponse | null> => {
  try {
    const amountInSmallestUnit = Math.floor(amount * (inputMint === TOKEN_MINTS.SOL ? 1e9 : 1e6)); // SOL has 9 decimals, most tokens have 6
    
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amountInSmallestUnit.toString(),
      slippageBps: slippageBps.toString(),
    });

    const response = await fetch(`${JUPITER_API_URL}/quote?${params}`);
    
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.statusText}`);
    }

    const quote = await response.json();
    return quote;
  } catch (error) {
    console.error('Error getting Jupiter quote:', error);
    return null;
  }
};

// Get swap transaction from Jupiter
export const getJupiterSwapTransaction = async (
  swapRequest: SwapRequest
): Promise<VersionedTransaction | null> => {
  try {
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

    const { swapTransaction } = await response.json();
    
    // Deserialize the transaction
    const transactionBuf = Buffer.from(swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuf);
    
    return transaction;
  } catch (error) {
    console.error('Error getting Jupiter swap transaction:', error);
    return null;
  }
};

// Execute swap with Jupiter
export const executeJupiterSwap = async (
  userPublicKey: PublicKey,
  sendTransaction: any,
  inputToken: 'SOL' | 'GOLD',
  outputToken: 'SOL' | 'GOLD',
  amount: number,
  slippageBps: number = 50
): Promise<string | null> => {
  try {
    // Get token mint addresses
    const inputMint = TOKEN_MINTS[inputToken];
    const outputMint = TOKEN_MINTS[outputToken];

    // Get quote
    const quote = await getJupiterQuote(inputMint, outputMint, amount, slippageBps);
    if (!quote) {
      throw new Error('Failed to get quote from Jupiter');
    }

    // Get swap transaction
    const swapRequest: SwapRequest = {
      userPublicKey: userPublicKey.toString(),
      quoteResponse: quote,
    };

    const swapTransaction = await getJupiterSwapTransaction(swapRequest);
    if (!swapTransaction) {
      throw new Error('Failed to get swap transaction from Jupiter');
    }

    // Send transaction
    const signature = await sendTransaction(swapTransaction, connection);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  } catch (error) {
    console.error('Error executing Jupiter swap:', error);
    throw error;
  }
};

// Get token price from Jupiter
export const getTokenPrice = async (tokenMint: string): Promise<number | null> => {
  try {
    const response = await fetch(`${JUPITER_API_URL}/price?ids=${tokenMint}`);
    
    if (!response.ok) {
      throw new Error(`Jupiter price API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.[tokenMint]?.price || null;
  } catch (error) {
    console.error('Error getting token price:', error);
    return null;
  }
};