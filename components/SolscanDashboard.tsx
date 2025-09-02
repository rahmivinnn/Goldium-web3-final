import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { ExternalLink, Activity, TrendingUp, Clock, Coins } from 'lucide-react';
import { getSolscanUrl, getTransactionDetails } from '../lib/solana';
import { useTransactionHistory } from '../lib/transaction-tracker';

interface SolscanStats {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  averageTime: number;
}

const SolscanDashboard: React.FC = () => {
  const { publicKey } = useWallet();
  const transactions = useTransactionHistory();
  const [stats, setStats] = useState<SolscanStats>({
    totalTransactions: 0,
    totalVolume: 0,
    successRate: 0,
    averageTime: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (transactions.length > 0) {
      const confirmedTxs = transactions.filter(tx => tx.status === 'confirmed');
      const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const successRate = (confirmedTxs.length / transactions.length) * 100;

      setStats({
        totalTransactions: transactions.length,
        totalVolume,
        successRate,
        averageTime: 2.5 // Average Solana block time
      });

      setRecentTransactions(transactions.slice(0, 5));
    }
  }, [transactions]);

  if (!publicKey) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-8 text-center border border-white/20"
      >
        <Activity className="mx-auto mb-4 text-gold-400" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">Solscan Dashboard</h3>
        <p className="text-white/60">Connect your wallet to view transaction analytics</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="text-gold-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Solscan Analytics</h2>
        </div>
        <a
          href={`https://solscan.io/account/${publicKey.toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors"
        >
          <span>View Wallet on Solscan</span>
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="text-blue-400" size={20} />
            <span className="text-white/80 text-sm">Total Transactions</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Coins className="text-gold-400" size={20} />
            <span className="text-white/80 text-sm">Total Volume</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalVolume.toFixed(2)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <span className="text-white/80 text-sm">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.successRate.toFixed(1)}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-lg p-4 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="text-purple-400" size={20} />
            <span className="text-white/80 text-sm">Avg. Time</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.averageTime}s</div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <a
            href="https://solscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
          >
            <span>Powered by Solscan</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Activity size={32} className="mx-auto mb-2 opacity-50" />
            <p>No transactions yet</p>
            <p className="text-sm">Start using Goldium to see your transaction history</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <motion.div
                key={tx.signature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-gold-500/30 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.status === 'confirmed' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'}
                  </div>
                  <div>
                    <div className="text-white font-medium capitalize">{tx.type}</div>
                    <div className="text-xs text-white/60">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-white font-medium">{tx.amount} {tx.token}</div>
                    <div className="text-xs text-white/60 font-mono">
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                    </div>
                  </div>
                  <a
                    href={getSolscanUrl(tx.signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Solscan Integration Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-xl p-6 border border-blue-500/20 bg-blue-500/5"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Complete Transaction Transparency
            </h3>
            <p className="text-white/70 mb-4">
              Every transaction in Goldium is automatically tracked and verified on Solscan, 
              Solana's premier blockchain explorer. View real-time confirmations, gas fees, 
              and detailed transaction data.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm">
                Real-time tracking
              </span>
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm">
                Public verification
              </span>
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm">
                Gas fee monitoring
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SolscanDashboard;