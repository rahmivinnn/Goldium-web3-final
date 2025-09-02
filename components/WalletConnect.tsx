import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletStore } from '../lib/store';
import { getWalletBalances } from '../lib/solana';
import { motion } from 'framer-motion';
import { Wallet, Coins, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const WalletConnect: React.FC = () => {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const { solBalance, goldBalance, isLoading, setBalances, setLoading } = useWalletStore();

  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true);
      getWalletBalances(publicKey)
        .then(({ sol, gold }) => {
          setBalances(sol, gold);
          toast.success('Wallet connected to Solana Mainnet!');
        })
        .catch((error) => {
          console.error('Error fetching balances:', error);
          toast.error('Failed to fetch wallet balances');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [connected, publicKey, setBalances, setLoading]);

  const formatBalance = (balance: number, decimals: number = 4) => {
    return balance.toFixed(decimals);
  };

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md mx-auto text-center"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Connect Your Wallet</h2>
          <p className="text-white/70">
            Connect your Phantom or Solflare wallet to start using Goldium on Solana Mainnet
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Solana Mainnet</span>
            </div>
            <p className="text-white/60 text-xs mt-1">All transactions are tracked on Solscan</p>
          </div>
          
          <div className="text-sm text-white/60">
            Supported wallets: Phantom, Solflare
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold gradient-text">Wallet Connected</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={disconnect}
          className="text-white/60 hover:text-white transition-colors"
        >
          Disconnect
        </motion.button>
      </div>

      <div className="space-y-4">
        {/* Network Status */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Connected to Solana Mainnet</span>
          </div>
          <p className="text-white/60 text-xs mt-1">All transactions are tracked on Solscan</p>
        </div>

        {/* Wallet Address */}
        <div className="glass-dark rounded-lg p-4">
          <div className="text-sm text-white/60 mb-1">Wallet Address</div>
          <div className="text-white font-mono text-sm break-all">
            {publicKey?.toString()}
          </div>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-dark rounded-lg p-4 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-solana-400 mr-2" />
              <span className="text-white/60 text-sm">SOL</span>
            </div>
            <div className="text-xl font-bold text-white">
              {isLoading ? (
                <div className="animate-pulse bg-white/20 h-6 w-16 rounded mx-auto"></div>
              ) : (
                formatBalance(solBalance)
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-dark rounded-lg p-4 text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <Coins className="w-5 h-5 text-gold-400 mr-2" />
              <span className="text-white/60 text-sm">GOLD</span>
            </div>
            <div className="text-xl font-bold text-white">
              {isLoading ? (
                <div className="animate-pulse bg-white/20 h-6 w-16 rounded mx-auto"></div>
              ) : (
                formatBalance(goldBalance)
              )}
            </div>
          </motion.div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/60">Connected to Solana Mainnet</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletConnect;
