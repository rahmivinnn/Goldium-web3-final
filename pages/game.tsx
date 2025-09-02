import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import GameUI from '../components/GameUI';
import { Gamepad2, Trophy, Star, BookOpen, Zap, Target } from 'lucide-react';

const GamePage: React.FC = () => {
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
              Solana Knowledge Game
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Test your knowledge about Solana blockchain and earn NFT rewards!
            </p>
          </motion.div>

          <GameUI />

          {/* Game Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Game Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Educational</h3>
                <p className="text-white/70 text-sm">Learn about Solana blockchain through interactive questions</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fast Paced</h3>
                <p className="text-white/70 text-sm">30-second timer keeps the game exciting and challenging</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Rewards</h3>
                <p className="text-white/70 text-sm">Earn NFT rewards for scoring 60% or higher</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Progressive</h3>
                <p className="text-white/70 text-sm">Questions cover basics to advanced Solana concepts</p>
              </div>
            </div>
          </motion.div>

          {/* How to Play */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              How to Play
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">1. Start Game</h3>
                <p className="text-white/70">Click the start button to begin your Solana knowledge journey</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">2. Answer Questions</h3>
                <p className="text-white/70">Answer multiple-choice questions about Solana within the time limit</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">3. Earn Rewards</h3>
                <p className="text-white/70">Score 60% or higher to earn NFT rewards and bragging rights</p>
              </div>
            </div>
          </motion.div>

          {/* Topics Covered */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Topics Covered
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-dark rounded-lg p-4 text-center">
                <h4 className="font-semibold text-white mb-2">Blockchain Basics</h4>
                <p className="text-white/70 text-sm">Block time, consensus, and network fundamentals</p>
              </div>
              
              <div className="glass-dark rounded-lg p-4 text-center">
                <h4 className="font-semibold text-white mb-2">Solana Technology</h4>
                <p className="text-white/70 text-sm">Proof of History, validators, and architecture</p>
              </div>
              
              <div className="glass-dark rounded-lg p-4 text-center">
                <h4 className="font-semibold text-white mb-2">Token Standards</h4>
                <p className="text-white/70 text-sm">SPL tokens, NFTs, and token economics</p>
              </div>
              
              <div className="glass-dark rounded-lg p-4 text-center">
                <h4 className="font-semibold text-white mb-2">DeFi & Economics</h4>
                <p className="text-white/70 text-sm">Transaction fees, staking, and DeFi protocols</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default GamePage;
