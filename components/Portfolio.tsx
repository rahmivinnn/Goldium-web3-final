import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  PieChart, 
  BarChart3, 
  RefreshCw,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import axios from 'axios';

interface PortfolioData {
  wallet: string;
  portfolio: {
    total: {
      value: number;
      change24h: number;
      changePercent: number;
    };
    assets: Array<{
      symbol: string;
      name: string;
      balance: number;
      value: number;
      price: number;
      change24h: number;
      percentage: number;
    }>;
    staking: {
      totalStaked: number;
      estimatedRewards: number;
      value: number;
    };
    analytics: {
      totalTransactions: number;
      successfulTransactions: number;
      totalVolume: number;
      totalFees: number;
      successRate: number;
      averageFee: number;
    };
  };
  lastUpdated: string;
}

const Portfolio: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = async () => {
    if (!publicKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/portfolio/${publicKey.toString()}`);
      setPortfolioData(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Failed to fetch portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchPortfolioData();
      
      // Refresh every 30 seconds
      const interval = setInterval(fetchPortfolioData, 30000);
      return () => clearInterval(interval);
    }
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-8 text-center border border-white/20"
      >
        <PieChart className="mx-auto mb-4 text-gold-400" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">Portfolio Tracker</h3>
        <p className="text-white/60">Connect your wallet to view your DeFi portfolio</p>
      </motion.div>
    );
  }

  if (isLoading && !portfolioData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-8 text-center border border-white/20"
      >
        <RefreshCw className="mx-auto mb-4 text-blue-400 animate-spin" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">Loading Portfolio</h3>
        <p className="text-white/60">Fetching your DeFi data...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-xl p-8 text-center border border-red-500/20"
      >
        <div className="text-red-400 mb-4">❌</div>
        <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchPortfolioData}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  if (!portfolioData) return null;

  const { portfolio } = portfolioData;

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
            <p className="text-white/60">Real-time DeFi portfolio tracking</p>
          </div>
          <button
            onClick={fetchPortfolioData}
            disabled={isLoading}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={isLoading ? 'animate-spin' : ''} size={20} />
          </button>
        </div>

        {/* Total Value */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="text-4xl font-bold text-white mb-2">
              ${portfolio.total.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-2">
              {portfolio.total.changePercent >= 0 ? (
                <TrendingUp className="text-green-400" size={16} />
              ) : (
                <TrendingDown className="text-red-400" size={16} />
              )}
              <span className={`font-semibold ${
                portfolio.total.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolio.total.changePercent >= 0 ? '+' : ''}
                {portfolio.total.changePercent.toFixed(2)}%
              </span>
              <span className="text-white/60">24h</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white/60 text-sm">Last updated</div>
            <div className="text-white text-sm">
              {new Date(portfolioData.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assets Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Coins className="text-gold-400" size={20} />
          <span>Assets</span>
        </h3>

        <div className="space-y-4">
          {portfolio.assets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{asset.symbol}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{asset.name}</div>
                  <div className="text-white/60 text-sm">
                    {asset.balance.toLocaleString()} {asset.symbol}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-semibold">
                  ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${
                    asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </span>
                  <span className="text-white/60 text-sm">
                    {asset.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Staking Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="text-green-400" size={20} />
          <span>Staking</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {portfolio.staking.totalStaked.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">GOLD Staked</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {portfolio.staking.estimatedRewards.toFixed(2)}
            </div>
            <div className="text-white/60 text-sm">Pending Rewards</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              ${portfolio.staking.value.toFixed(2)}
            </div>
            <div className="text-white/60 text-sm">Staking Value</div>
          </div>
        </div>
      </motion.div>

      {/* Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="text-purple-400" size={20} />
          <span>Transaction Analytics</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400 mb-1">
              {portfolio.analytics.totalTransactions}
            </div>
            <div className="text-white/60 text-sm">Total Transactions</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-green-400 mb-1">
              {portfolio.analytics.successRate.toFixed(1)}%
            </div>
            <div className="text-white/60 text-sm">Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-gold-400 mb-1">
              {portfolio.analytics.totalVolume.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Total Volume</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-purple-400 mb-1">
              {portfolio.analytics.totalFees.toFixed(4)}
            </div>
            <div className="text-white/60 text-sm">Total Fees (SOL)</div>
          </div>
        </div>
      </motion.div>

      {/* Solscan Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6 border border-blue-500/20 bg-blue-500/5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Solscan Integration Active
            </h3>
            <p className="text-white/70 text-sm">
              All transactions are automatically tracked and verified on Solscan
            </p>
          </div>
          <a
            href={`https://solscan.io/account/${publicKey?.toString()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>View on Solscan</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Portfolio;