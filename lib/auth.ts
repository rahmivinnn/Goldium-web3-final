import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

export interface User {
  id: string;
  walletAddress: string;
  totalTransactions: number;
  totalVolume: number;
  gameScore: number;
  gamesPlayed: number;
  nftRewards: number;
  lessonsCompleted: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

// Authenticate with wallet
export const authenticateWallet = async (
  walletAddress: string,
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>
): Promise<AuthResponse> => {
  try {
    // Verify wallet address format
    new PublicKey(walletAddress);

    // Create authentication message
    const message = `Goldium DeFi Authentication\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;
    const messageBytes = new TextEncoder().encode(message);

    let signature = '';
    
    // Sign message if signMessage function is provided
    if (signMessage) {
      try {
        const signedMessage = await signMessage(messageBytes);
        signature = Buffer.from(signedMessage).toString('base64');
      } catch (error) {
        console.log('Message signing skipped or failed');
      }
    }

    // Authenticate with backend
    const response = await axios.post('/api/auth/wallet', {
      walletAddress,
      signature,
      message
    });

    return response.data;
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
};

// Get user data
export const getUserData = async (walletAddress: string): Promise<User | null> => {
  try {
    const response = await axios.get(`/api/auth/wallet?walletAddress=${walletAddress}`);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Get user analytics
export const getUserAnalytics = async (walletAddress: string) => {
  try {
    const response = await axios.get(`/api/users/${walletAddress}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

// Submit game score
export const submitGameScore = async (
  walletAddress: string,
  score: number,
  totalQuestions: number,
  timeSpent: number,
  category: string = 'mixed'
) => {
  try {
    // Try main API first
    const response = await axios.post('/api/game/submit-score', {
      walletAddress,
      score,
      totalQuestions,
      timeSpent,
      category
    });
    return response.data;
  } catch (error) {
    console.error('Main API failed, trying simple API:', error);
    
    // Fallback to simple API
    try {
      const response = await axios.post('/api/simple/game', {
        walletAddress,
        score,
        totalQuestions,
        timeSpent,
        category
      });
      return response.data;
    } catch (fallbackError) {
      console.error('Error submitting game score:', fallbackError);
      throw fallbackError;
    }
  }
};

// Mint NFT reward
export const mintNFTReward = async (
  walletAddress: string,
  gameScore: number,
  category: string,
  achievementType: string = 'perfect_score'
) => {
  try {
    const response = await axios.post('/api/nft/mint-reward', {
      walletAddress,
      gameScore,
      category,
      achievementType
    });
    return response.data;
  } catch (error) {
    console.error('Error minting NFT reward:', error);
    throw error;
  }
};

// Record staking transaction
export const recordStakingTransaction = async (
  walletAddress: string,
  amount: number,
  signature: string,
  apy: number = 12.5,
  lockPeriod: number = 30
) => {
  try {
    const response = await axios.post('/api/staking/stake', {
      walletAddress,
      amount,
      signature,
      apy,
      lockPeriod
    });
    return response.data;
  } catch (error) {
    console.error('Error recording staking transaction:', error);
    throw error;
  }
};

// Local storage helpers
export const saveAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('goldium_auth_token', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('goldium_auth_token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('goldium_auth_token');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};