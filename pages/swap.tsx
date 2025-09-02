import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SwapCard from '../components/SwapCard';
import { TrendingUp, Zap, Shield } from 'lucide-react';

const SwapPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Swap Tokens
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Exchange SOL and GOLD tokens instantly using Jupiter's best routing on Solana Mainnet
            </p>
          </motion.div>

          <div className="flex justify-center">
            <SwapCard />
          </div>

          {/* Market Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Live Market Data
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-solana-500 to-solana-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">SOL Price</h3>
                <p className="text-2xl font-bold gradient-text">.50</p>
                <p className="text-sm text-green-400">+2.5% (24h)</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">GOLD Price</h3>
                <p className="text-2xl font-bold gradient-text">.245</p>
                <p className="text-sm text-green-400">+5.2% (24h)</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Liquidity</h3>
                <p className="text-2xl font-bold gradient-text">.4M</p>
                <p className="text-sm text-white/70">Total Pool</p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Why Use Goldium Swap?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Best Prices</h3>
                <p className="text-white/70 text-sm">Get the best exchange rates using Jupiter's routing on Mainnet</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
                <p className="text-white/70 text-sm">All swaps are executed on-chain with full transparency on Solscan</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fast</h3>
                <p className="text-white/70 text-sm">Complete swaps in seconds with Solana Mainnet's speed</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Low Fees</h3>
                <p className="text-white/70 text-sm">Minimal transaction fees on Solana Mainnet</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SwapPage;
