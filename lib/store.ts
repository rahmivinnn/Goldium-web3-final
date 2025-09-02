import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';

interface WalletState {
  publicKey: PublicKey | null;
  connected: boolean;
  solBalance: number;
  goldBalance: number;
  isLoading: boolean;
  error: string | null;
}

interface WalletActions {
  setWallet: (publicKey: PublicKey | null, connected: boolean) => void;
  setBalances: (solBalance: number, goldBalance: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>((set) => ({
  // State
  publicKey: null,
  connected: false,
  solBalance: 0,
  goldBalance: 0,
  isLoading: false,
  error: null,

  // Actions
  setWallet: (publicKey, connected) => 
    set({ publicKey, connected }),

  setBalances: (solBalance, goldBalance) => 
    set({ solBalance, goldBalance }),

  setLoading: (isLoading) => 
    set({ isLoading }),

  setError: (error) => 
    set({ error }),

  reset: () => 
    set({
      publicKey: null,
      connected: false,
      solBalance: 0,
      goldBalance: 0,
      isLoading: false,
      error: null,
    }),
}));

// Swap store
interface SwapState {
  fromToken: 'SOL' | 'GOLD';
  toToken: 'SOL' | 'GOLD';
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isLoading: boolean;
  error: string | null;
}

interface SwapActions {
  setFromToken: (token: 'SOL' | 'GOLD') => void;
  setToToken: (token: 'SOL' | 'GOLD') => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  swapTokens: () => void;
  reset: () => void;
}

type SwapStore = SwapState & SwapActions;

export const useSwapStore = create<SwapStore>((set, get) => ({
  // State
  fromToken: 'SOL',
  toToken: 'GOLD',
  fromAmount: '',
  toAmount: '',
  slippage: 0.5,
  isLoading: false,
  error: null,

  // Actions
  setFromToken: (fromToken) => {
    const { toToken } = get();
    if (fromToken === toToken) {
      set({ toToken: fromToken === 'SOL' ? 'GOLD' : 'SOL' });
    }
    set({ fromToken });
  },

  setToToken: (toToken) => {
    const { fromToken } = get();
    if (toToken === fromToken) {
      set({ fromToken: toToken === 'SOL' ? 'GOLD' : 'SOL' });
    }
    set({ toToken });
  },

  setFromAmount: (fromAmount) => set({ fromAmount }),
  setToAmount: (toAmount) => set({ toAmount }),
  setSlippage: (slippage) => set({ slippage }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  swapTokens: () => {
    // This will be implemented in the swap logic
    console.log('Swapping tokens...');
  },

  reset: () => set({
    fromToken: 'SOL',
    toToken: 'GOLD',
    fromAmount: '',
    toAmount: '',
    slippage: 0.5,
    isLoading: false,
    error: null,
  }),
}));
