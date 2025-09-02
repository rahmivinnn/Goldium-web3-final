import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import StakeCard from '../components/StakeCard';
import { Coins, TrendingUp, Shield, Clock } from 'lucide-react';

const StakePage: React.FC = () => {
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
              Stake GOLD Tokens
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Earn rewards by staking your GOLD tokens on Solana Mainnet. Secure, transparent, and profitable.
            </p>
          </motion.div>

          <StakeCard />

          {/* How Staking Works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              How Staking Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">1. Stake</h3>
                <p className="text-white/70 text-sm">Lock your GOLD tokens in our secure staking pool on Mainnet</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">2. Earn</h3>
                <p className="text-white/70 text-sm">Start earning rewards immediately with 12.5% APY</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">3. Compound</h3>
                <p className="text-white/70 text-sm">Rewards are calculated daily and compound automatically</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">4. Claim</h3>
                <p className="text-white/70 text-sm">Claim your rewards anytime or unstake after 30 days</p>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Staking Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">High APY</h3>
                <p className="text-white/70">Earn up to 12.5% annual percentage yield on your staked GOLD tokens</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
                <p className="text-white/70">Your tokens are secured by smart contracts on Solana Mainnet</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transparent</h3>
                <p className="text-white/70">All staking transactions are publicly verifiable on Solscan</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StakePage;
