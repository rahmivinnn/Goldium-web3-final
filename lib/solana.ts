import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddress } from '@solana/spl-token';

// Solana network configuration - MAINNET
export const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl('mainnet-beta');

// Create connection instance
export const connection = new Connection(RPC_URL, 'confirmed');

// Goldium token configuration - Replace with actual GOLD token mint address
export const GOLD_TOKEN_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_GOLD_TOKEN_MINT || 'So11111111111111111111111111111111111111112' // SOL as placeholder
);

// Utility functions for token operations
export const getTokenBalance = async (walletAddress: PublicKey, tokenMint: PublicKey): Promise<number> => {
  try {
    const tokenAccount = await getAssociatedTokenAddress(tokenMint, walletAddress);
    const accountInfo = await getAccount(connection, tokenAccount);
    return Number(accountInfo.amount);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
};

export const getSOLBalance = async (walletAddress: PublicKey): Promise<number> => {
  try {
    const balance = await connection.getBalance(walletAddress);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return 0;
  }
};

export const getWalletBalances = async (walletAddress: PublicKey) => {
  const [solBalance, goldBalance] = await Promise.all([
    getSOLBalance(walletAddress),
    getTokenBalance(walletAddress, GOLD_TOKEN_MINT)
  ]);

  return {
    sol: solBalance,
    gold: goldBalance
  };
};

// Transaction utilities
export const confirmTransaction = async (signature: string) => {
  const latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature,
    ...latestBlockhash
  });
  return signature;
};

// Network status
export const getNetworkTPS = async (): Promise<number> => {
  try {
    const performanceSamples = await connection.getRecentPerformanceSamples(1);
    return performanceSamples[0]?.numTransactions / performanceSamples[0]?.samplePeriodSecs || 0;
  } catch (error) {
    console.error('Error fetching TPS:', error);
    return 0;
  }
};

// Solscan explorer URL generator
export const getSolscanUrl = (signature: string): string => {
  return https://solscan.io/tx/;
};

// Get transaction details from Solscan
export const getTransactionDetails = async (signature: string) => {
  try {
    const response = await fetch(https://public-api.solscan.io/transaction/);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
};
