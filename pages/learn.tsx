import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import LearnCard from '../components/LearnCard';
import { BookOpen, Zap, Coins, Shield, Globe, Target, Award, Users } from 'lucide-react';

const LearnPage: React.FC = () => {
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
              Learn Solana
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Master the fundamentals of Solana blockchain through interactive lessons
            </p>
          </motion.div>

          <LearnCard />

          {/* Learning Path */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Learning Path
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Basics</h3>
                <p className="text-white/70 text-sm">Understand what Solana is and how it works</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Technology</h3>
                <p className="text-white/70 text-sm">Learn about Proof of History and consensus</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Tokens</h3>
                <p className="text-white/70 text-sm">Master SPL tokens and token standards</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Economics</h3>
                <p className="text-white/70 text-sm">Understand fees, staking, and DeFi</p>
              </div>
            </div>
          </motion.div>

          {/* Why Learn Solana */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Why Learn Solana?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">High Performance</h3>
                <p className="text-white/70">Solana can process 65,000+ transactions per second with sub-second finality</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Low Cost</h3>
                <p className="text-white/70">Transaction fees are typically under .00025, making it extremely affordable</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Growing Ecosystem</h3>
                <p className="text-white/70">Join thousands of developers building the future of Web3 on Solana</p>
              </div>
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Additional Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Official Documentation</h3>
                </div>
                <p className="text-white/70 mb-4">
                  Comprehensive guides and API references for Solana development
                </p>
                <a
                  href="https://docs.solana.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Visit Docs 
                </a>
              </div>
              
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Solana Cookbook</h3>
                </div>
                <p className="text-white/70 mb-4">
                  Practical examples and code snippets for common Solana tasks
                </p>
                <a
                  href="https://solanacookbook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  Visit Cookbook 
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
