import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SolscanDashboard from '../components/SolscanDashboard';
import TransactionHistory from '../components/TransactionHistory';
import LiveSolscanFeed from '../components/LiveSolscanFeed';
import Portfolio from '../components/Portfolio';
import { useWallet } from '@solana/wallet-adapter-react';
import { Activity, BarChart3, History, ExternalLink } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                    Transaction Dashboard
                  </span>
                </h1>
                <p className="text-white/70">
                  Monitor all your DeFi transactions on Solana Mainnet
                </p>
              </div>
              
              {connected && publicKey && (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-white/60">Connected Wallet</div>
                    <div className="text-white font-mono text-sm">
                      {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                    </div>
                  </div>
                  <a
                    href={`https://solscan.io/account/${publicKey.toString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-3 rounded-lg transition-colors"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {!connected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-xl p-12 text-center border border-white/20"
            >
              <Activity className="mx-auto mb-6 text-gold-400" size={64} />
              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Connect your Solana wallet to view your transaction history and analytics
              </p>
              <button className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Connect Wallet
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Portfolio Overview */}
              <Portfolio />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Solscan Dashboard */}
                  <SolscanDashboard />
                </div>
                
                {/* Right Column */}
                <div className="space-y-8">
                  {/* Live Solscan Feed */}
                  <LiveSolscanFeed />
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <BarChart3 className="text-gold-400" size={20} />
                  <span>Quick Actions</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a
                    href="/send"
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-4 rounded-lg transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">📤</div>
                    <div className="font-medium">Send Tokens</div>
                  </a>
                  
                  <a
                    href="/swap"
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 p-4 rounded-lg transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">🔄</div>
                    <div className="font-medium">Swap Tokens</div>
                  </a>
                  
                  <a
                    href="/stake"
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-4 rounded-lg transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">🏦</div>
                    <div className="font-medium">Stake GOLD</div>
                  </a>
                  
                  <a
                    href="https://solscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 p-4 rounded-lg transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-medium">Solscan</div>
                  </a>
                </div>
              </motion.div>

              {/* Live Solana Network Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Activity className="text-green-400" size={20} />
                  <span>Live Solana Network</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">~400ms</div>
                    <div className="text-white/70 text-sm">Block Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">65,000+</div>
                    <div className="text-white/70 text-sm">TPS Capacity</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">$0.00025</div>
                    <div className="text-white/70 text-sm">Avg. Fee</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;