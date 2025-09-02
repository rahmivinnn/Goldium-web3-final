import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSwapStore } from '../lib/store';
import { motion } from 'framer-motion';
import { ArrowUpDown, Coins, Zap, TrendingUp, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSolscanUrl } from '../lib/solana';

const SwapCard: React.FC = () => {
  const { publicKey } = useWallet();
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    isLoading,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
    setSlippage,
    setLoading,
    setError
  } = useSwapStore();

  const [price, setPrice] = useState<number>(0);
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [lastSwapSignature, setLastSwapSignature] = useState<string | null>(null);

  // Mock price fetching - in real implementation, this would use Jupiter API
  useEffect(() => {
    const fetchPrice = async () => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        // Mock price calculation
        const mockPrice = fromToken === 'SOL' ? 100 : 0.01; // 1 SOL = 100 GOLD, 1 GOLD = 0.01 SOL
        setPrice(mockPrice);
        
        const calculatedAmount = parseFloat(fromAmount) * mockPrice;
        setToAmount(calculatedAmount.toFixed(6));
        
        // Mock price impact calculation
        setPriceImpact(0.1);
      }
    };

    fetchPrice();
  }, [fromAmount, fromToken, setToAmount]);

  const handleSwapTokens = () => {
    const newFromToken = toToken;
    const newToToken = fromToken;
    setFromToken(newFromToken);
    setToToken(newToToken);
    
    // Swap amounts
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Mock swap transaction - in real implementation, this would use Jupiter SDK
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction signature
      const mockSignature = 'mock_signature_' + Date.now();
      setLastSwapSignature(mockSignature);
      
      toast.success('Swap completed successfully!');
      
      // Show Solscan link
      const solscanUrl = getSolscanUrl(mockSignature);
      toast.success(
        <div>
          <p>Swap completed successfully!</p>
          <a 
            href={solscanUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            View on Solscan 
          </a>
        </div>,
        { duration: 8000 }
      );
      
      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error: any) {
      console.error('Swap failed:', error);
      setError(error.message || 'Swap failed');
      toast.error(error.message || 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMaxAmount = () => {
    // Mock max amount - in real implementation, this would fetch actual balance
    setFromAmount('1.0');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <ArrowUpDown className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold gradient-text">Swap Tokens</h2>
        </div>
        <div className="text-sm text-white/60">
          1 {fromToken} = {price.toFixed(4)} {toToken}
        </div>
      </div>

      <div className="space-y-4">
        {/* Network Info */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Solana Mainnet</span>
          </div>
          <p className="text-white/60 text-xs mt-1">Powered by Jupiter API  Tracked on Solscan</p>
        </div>

        {/* From Token */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            From
          </label>
          <div className="glass-dark rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {fromToken === 'SOL' ? (
                  <Zap className="w-5 h-5 text-solana-400" />
                ) : (
                  <Coins className="w-5 h-5 text-gold-400" />
                )}
                <span className="font-medium text-white">{fromToken}</span>
              </div>
              <button
                onClick={handleMaxAmount}
                className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded hover:bg-gold-500/30 transition-colors"
              >
                MAX
              </button>
            </div>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              step="0.000001"
              className="w-full bg-transparent text-2xl font-bold text-white placeholder-white/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSwapTokens}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <ArrowUpDown className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            To
          </label>
          <div className="glass-dark rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              {toToken === 'SOL' ? (
                <Zap className="w-5 h-5 text-solana-400" />
              ) : (
                <Coins className="w-5 h-5 text-gold-400" />
              )}
              <span className="font-medium text-white">{toToken}</span>
            </div>
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.00"
              className="w-full bg-transparent text-2xl font-bold text-white placeholder-white/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Price Impact */}
        {priceImpact > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Price Impact</span>
            <span className={${priceImpact > 5 ? 'text-red-400' : 'text-green-400'}}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>
        )}

        {/* Slippage Settings */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Slippage Tolerance
          </label>
          <div className="flex space-x-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={lex-1 py-2 px-4 rounded-lg font-medium transition-all }
              >
                {value}%
              </button>
            ))}
            <input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
              placeholder="Custom"
              step="0.1"
              className="flex-1 py-2 px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        {/* Swap Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSwap}
          disabled={isLoading || !publicKey || !fromAmount}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Swapping...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <ArrowUpDown className="w-4 h-4" />
              <span>Swap {fromToken} for {toToken}</span>
            </div>
          )}
        </motion.button>

        {/* Connection Status */}
        {!publicKey && (
          <div className="text-center text-white/60 text-sm">
            Connect your wallet to start swapping
          </div>
        )}

        {/* Last Swap Link */}
        {lastSwapSignature && (
          <div className="text-center">
            <a
              href={getSolscanUrl(lastSwapSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View Last Swap on Solscan</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SwapCard;
