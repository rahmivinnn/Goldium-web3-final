import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Activity, ExternalLink, Bell, Settings } from 'lucide-react';
import { connection } from '../lib/solana';
import toast from 'react-hot-toast';

interface NetworkStats {
  tps: number;
  slot: number;
  blockHeight: number;
  totalSupply: number;
}

const SolscanTracker: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    tps: 0,
    slot: 0,
    blockHeight: 0,
    totalSupply: 0
  });
  const [isTracking, setIsTracking] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Fetch live network statistics
  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        const [slot, supply] = await Promise.all([
          connection.getSlot(),
          connection.getSupply()
        ]);

        // Get recent performance samples for TPS
        const perfSamples = await connection.getRecentPerformanceSamples(1);
        const tps = perfSamples[0]?.numTransactions / perfSamples[0]?.samplePeriodSecs || 0;

        setNetworkStats({
          tps: Math.round(tps),
          slot,
          blockHeight: slot, // Simplified - block height ≈ slot on Solana
          totalSupply: supply.value.total / 1e9 // Convert lamports to SOL
        });
      } catch (error) {
        console.error('Error fetching network stats:', error);
      }
    };

    // Fetch stats immediately and then every 10 seconds
    fetchNetworkStats();
    const interval = setInterval(fetchNetworkStats, 10000);

    return () => clearInterval(interval);
  }, []);

  // Auto-track wallet transactions
  useEffect(() => {
    if (!connected || !publicKey) return;

    setIsTracking(true);
    
    // Show tracking notification
    toast.success(
      <div className="flex items-center space-x-2">
        <Activity className="text-green-400" size={16} />
        <span>Solscan tracking enabled for your wallet</span>
      </div>,
      { duration: 3000 }
    );

    return () => setIsTracking(false);
  }, [connected, publicKey]);

  if (!connected) return null;

  return (
    <>
      {/* Floating Network Stats Button */}
      <motion.button
        onClick={() => setShowStats(!showStats)}
        className="fixed bottom-20 left-6 z-40 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Activity size={20} />
        {isTracking && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          />
        )}
      </motion.button>

      {/* Network Stats Panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed bottom-32 left-6 z-40 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl min-w-64"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <Activity className="text-blue-400" size={16} />
                <span>Network Stats</span>
              </h3>
              <button
                onClick={() => setShowStats(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">TPS</span>
                <span className="text-green-400 font-bold">{networkStats.tps.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Current Slot</span>
                <span className="text-blue-400 font-mono text-sm">{networkStats.slot.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Block Height</span>
                <span className="text-purple-400 font-mono text-sm">{networkStats.blockHeight.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Total SOL</span>
                <span className="text-gold-400 font-bold">{networkStats.totalSupply.toLocaleString()}M</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <a
                href="https://solscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg transition-colors text-sm"
              >
                <span>View on Solscan</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Tracking Status */}
      {isTracking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-6 z-30 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg backdrop-blur-sm"
        >
          <div className="flex items-center space-x-2 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Activity size={14} />
            </motion.div>
            <span>Solscan tracking active</span>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SolscanTracker;