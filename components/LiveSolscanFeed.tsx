import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Activity, ExternalLink, Zap, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { getSolscanUrl, connection } from '../lib/solana';
import { useTransactionHistory } from '../lib/transaction-tracker';

interface LiveTransaction {
  signature: string;
  type: string;
  amount: number;
  token: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'failed';
  fee: number;
  slot: number;
}

const LiveSolscanFeed: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const userTransactions = useTransactionHistory();
  const [liveTransactions, setLiveTransactions] = useState<LiveTransaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkTPS, setNetworkTPS] = useState(0);

  // Fetch live network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        // Get recent performance samples for TPS
        const perfSamples = await connection.getRecentPerformanceSamples(1);
        const tps = perfSamples[0]?.numTransactions / perfSamples[0]?.samplePeriodSecs || 0;
        setNetworkTPS(Math.round(tps));

        // Convert user transactions to live feed format
        const liveTxs: LiveTransaction[] = userTransactions.slice(0, 10).map(tx => ({
          signature: tx.signature,
          type: tx.type,
          amount: tx.amount,
          token: tx.token,
          timestamp: tx.timestamp,
          status: tx.status as any,
          fee: 0.000005, // Mock fee - in real implementation, fetch from transaction details
          slot: 0 // Mock slot - in real implementation, fetch from transaction details
        }));

        setLiveTransactions(liveTxs);
      } catch (error) {
        console.error('Error fetching network data:', error);
      }
    };

    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [userTransactions]);

  const refreshFeed = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, this would fetch latest transactions from Solscan API
    setIsRefreshing(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return '📤';
      case 'swap': return '🔄';
      case 'stake': return '🏦';
      case 'unstake': return '🏃';
      case 'claim': return '🎁';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!connected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Activity className="text-blue-400" size={24} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Live Solscan Feed</h3>
            <p className="text-white/60 text-sm">Real-time transaction monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-white/60">Network TPS</div>
            <div className="text-green-400 font-bold">{networkTPS.toLocaleString()}</div>
          </div>
          <button
            onClick={refreshFeed}
            disabled={isRefreshing}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={16} />
          </button>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Zap className="text-yellow-400 mx-auto mb-1" size={16} />
          <div className="text-xs text-white/60">Avg Block Time</div>
          <div className="text-white font-bold">~400ms</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <TrendingUp className="text-green-400 mx-auto mb-1" size={16} />
          <div className="text-xs text-white/60">Success Rate</div>
          <div className="text-white font-bold">99.9%</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Clock className="text-purple-400 mx-auto mb-1" size={16} />
          <div className="text-xs text-white/60">Avg Fee</div>
          <div className="text-white font-bold">$0.00025</div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {liveTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-400"
            >
              <Activity size={32} className="mx-auto mb-2 opacity-50" />
              <p>No recent transactions</p>
              <p className="text-xs mt-1">Start using Goldium to see live activity</p>
            </motion.div>
          ) : (
            liveTransactions.map((tx, index) => (
              <motion.div
                key={tx.signature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:border-gold-500/30 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{getTransactionIcon(tx.type)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium capitalize">{tx.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)} bg-current bg-opacity-20`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="text-xs text-white/60">
                      {new Date(tx.timestamp).toLocaleTimeString()} • Fee: {tx.fee} SOL
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-white font-medium">{tx.amount} {tx.token}</div>
                    <div className="text-xs text-white/60 font-mono">
                      {tx.signature.slice(0, 6)}...{tx.signature.slice(-6)}
                    </div>
                  </div>
                  <a
                    href={getSolscanUrl(tx.signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Solscan Link */}
      <div className="mt-4 pt-4 border-t border-white/10 text-center">
        <a
          href={publicKey ? `https://solscan.io/account/${publicKey.toString()}` : 'https://solscan.io'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          <span>View Full History on Solscan</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
};

export default LiveSolscanFeed;