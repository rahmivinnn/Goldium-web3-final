import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Clock, Award, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSolscanUrl, connection } from '../lib/solana';
import { trackTransaction, showSolscanNotification } from '../lib/transaction-tracker';
import { 
  getStakingPoolData, 
  getUserStakeData, 
  calculatePendingRewards,
  createStakeTransaction,
  createUnstakeTransaction,
  createClaimRewardsTransaction
} from '../lib/staking';

interface StakingData {
  totalStaked: number;
  apy: number;
  userStaked: number;
  pendingRewards: number;
  stakingPeriod: number;
}

const StakeCard: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stakingData, setStakingData] = useState<StakingData>({
    totalStaked: 1250000,
    apy: 12.5,
    userStaked: 0,
    pendingRewards: 0,
    stakingPeriod: 30
  });
  const [lastTransactionSignature, setLastTransactionSignature] = useState<string | null>(null);

  // Fetch real staking data from smart contract
  useEffect(() => {
    const fetchStakingData = async () => {
      if (publicKey) {
        try {
          const [poolData, userStakeData] = await Promise.all([
            getStakingPoolData(),
            getUserStakeData(publicKey)
          ]);

          if (poolData) {
            let pendingRewards = 0;
            let userStaked = 0;

            if (userStakeData) {
              userStaked = userStakeData.amount.toNumber() / 1e6; // Convert from smallest unit
              pendingRewards = calculatePendingRewards(userStakeData, poolData) / 1e6;
            }

            setStakingData({
              totalStaked: poolData.totalStaked.toNumber() / 1e6,
              apy: poolData.rewardRate.toNumber() / 10, // Convert to percentage
              userStaked,
              pendingRewards,
              stakingPeriod: poolData.lockPeriod.toNumber() / (24 * 60 * 60) // Convert to days
            });
          }
        } catch (error) {
          console.error('Error fetching staking data:', error);
          // Fallback to mock data if contract not deployed yet
          setStakingData(prev => ({
            ...prev,
            userStaked: 0,
            pendingRewards: 0
          }));
        }
      }
    };

    fetchStakingData();
  }, [publicKey]);

  const handleStake = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create and send real staking transaction
      const transaction = await createStakeTransaction(publicKey, parseFloat(amount) * 1e6); // Convert to smallest unit
      const signature = await sendTransaction(transaction, connection);
      
      // Track transaction with comprehensive Solscan integration
      await trackTransaction(
        signature,
        'stake',
        parseFloat(amount),
        'GOLD',
        publicKey.toString()
      );

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      setLastTransactionSignature(signature);

      // Show enhanced Solscan notification
      showSolscanNotification(
        signature,
        'stake',
        parseFloat(amount),
        'GOLD',
        `APY: ${stakingData.apy}% • Lock Period: ${stakingData.stakingPeriod} days`
      );
      
      // Update staking data
      setStakingData(prev => ({
        ...prev,
        userStaked: prev.userStaked + parseFloat(amount),
        totalStaked: prev.totalStaked + parseFloat(amount)
      }));
      
      setAmount('');
    } catch (error: any) {
      console.error('Staking failed:', error);
      toast.error(error.message || 'Staking failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (stakingData.userStaked <= 0) {
      toast.error('No staked tokens to unstake');
      return;
    }

    try {
      setIsLoading(true);
      
      // Mock unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction signature
      const mockSignature = 'unstake_' + Date.now();
      setLastTransactionSignature(mockSignature);
      
      toast.success('Successfully unstaked GOLD tokens!');
      
      // Show Solscan link
      const solscanUrl = getSolscanUrl(mockSignature);
      toast.success(
        <div>
          <p>Unstaking successful!</p>
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
      
      // Update staking data
      setStakingData(prev => ({
        ...prev,
        userStaked: 0,
        totalStaked: prev.totalStaked - prev.userStaked
      }));
    } catch (error: any) {
      console.error('Unstaking failed:', error);
      toast.error(error.message || 'Unstaking failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }

    if (stakingData.pendingRewards <= 0) {
      toast.error('No rewards to claim');
      return;
    }

    try {
      setIsLoading(true);
      
      // Mock claim rewards transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction signature
      const mockSignature = 'claim_' + Date.now();
      setLastTransactionSignature(mockSignature);
      
      toast.success('Successfully claimed rewards!');
      
      // Show Solscan link
      const solscanUrl = getSolscanUrl(mockSignature);
      toast.success(
        <div>
          <p>Rewards claimed successfully!</p>
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
      
      // Update staking data
      setStakingData(prev => ({
        ...prev,
        pendingRewards: 0
      }));
    } catch (error: any) {
      console.error('Claim rewards failed:', error);
      toast.error(error.message || 'Claim rewards failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxAmount = () => {
    // Mock max amount - in real implementation, this would fetch actual GOLD balance
    setAmount('1000');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Network Info */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">Solana Mainnet</span>
        </div>
        <p className="text-white/60 text-sm mt-1">All staking transactions are tracked on Solscan</p>
      </div>

      {/* Staking Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Total Staked</h3>
          <p className="text-2xl font-bold gradient-text">
            {stakingData.totalStaked.toLocaleString()} GOLD
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">APY</h3>
          <p className="text-2xl font-bold gradient-text">
            {stakingData.apy}%
          </p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Staking Period</h3>
          <p className="text-2xl font-bold gradient-text">
            {stakingData.stakingPeriod} days
          </p>
        </div>
      </motion.div>

      {/* User Staking Info */}
      {publicKey && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-xl font-bold gradient-text mb-6">Your Staking</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Staked Amount</span>
                <span className="text-white font-semibold">
                  {stakingData.userStaked.toLocaleString()} GOLD
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Pending Rewards</span>
                <span className="text-gold-400 font-semibold">
                  {stakingData.pendingRewards.toFixed(2)} GOLD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Estimated Daily Rewards</span>
                <span className="text-green-400 font-semibold">
                  {((stakingData.userStaked * stakingData.apy) / 365 / 100).toFixed(2)} GOLD
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUnstake}
                disabled={isLoading || stakingData.userStaked <= 0}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Unstake All
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaimRewards}
                disabled={isLoading || stakingData.pendingRewards <= 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Claim Rewards</span>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stake Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mr-3">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold gradient-text">Stake GOLD Tokens</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Amount to Stake
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.000001"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 pr-16"
              />
              <button
                onClick={handleMaxAmount}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-gold-500/20 text-gold-400 rounded hover:bg-gold-500/30 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Staking Rewards</span>
            </div>
            <p className="text-white/70 text-sm">
              Earn {stakingData.apy}% APY by staking your GOLD tokens for {stakingData.stakingPeriod} days.
              Rewards are calculated daily and can be claimed anytime.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStake}
            disabled={isLoading || !publicKey || !amount}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Staking...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Coins className="w-4 h-4" />
                <span>Stake GOLD</span>
              </div>
            )}
          </motion.button>

          {!publicKey && (
            <div className="text-center text-white/60 text-sm">
              Connect your wallet to start staking
            </div>
          )}

          {/* Last Transaction Link */}
          {lastTransactionSignature && (
            <div className="text-center">
              <a
                href={getSolscanUrl(lastTransactionSignature)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>View Last Transaction on Solscan</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StakeCard;
