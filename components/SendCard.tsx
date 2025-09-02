import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { connection, GOLD_TOKEN_MINT, confirmTransaction, getSolscanUrl } from '../lib/solana';
import { motion } from 'framer-motion';
import { Send, Coins, Zap, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface SendCardProps {
  onTransactionComplete?: (signature: string) => void;
}

const SendCard: React.FC<SendCardProps> = ({ onTransactionComplete }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenType, setTokenType] = useState<'SOL' | 'GOLD'>('SOL');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!publicKey || !recipient || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const recipientPubkey = new PublicKey(recipient);
      const amountNum = parseFloat(amount);

      if (amountNum <= 0) {
        toast.error('Amount must be greater than 0');
        return;
      }

      let signature: string;

      if (tokenType === 'SOL') {
        // Send SOL
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports: amountNum * LAMPORTS_PER_SOL,
          })
        );

        signature = await sendTransaction(transaction, connection);
      } else {
        // Send GOLD tokens
        const sourceTokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, publicKey);
        const destinationTokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, recipientPubkey);

        const transaction = new Transaction().add(
          createTransferInstruction(
            sourceTokenAccount,
            destinationTokenAccount,
            publicKey,
            amountNum * 1e9, // Assuming 9 decimals for GOLD token
            [],
            TOKEN_PROGRAM_ID
          )
        );

        signature = await sendTransaction(transaction, connection);
      }

      await confirmTransaction(signature);
      toast.success('Transaction successful!');
      
      // Show Solscan link
      const solscanUrl = getSolscanUrl(signature);
      toast.success(
        <div>
          <p>Transaction successful!</p>
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
      
      if (onTransactionComplete) {
        onTransactionComplete(signature);
      }

      // Reset form
      setRecipient('');
      setAmount('');
    } catch (error: any) {
      console.error('Send transaction failed:', error);
      toast.error(error.message || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxAmount = () => {
    // This would be implemented with actual balance fetching
    setAmount('1.0'); // Placeholder
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-md mx-auto"
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
          <Send className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">Send Tokens</h2>
      </div>

      <div className="space-y-4">
        {/* Network Info */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Connected to Solana Mainnet</span>
          </div>
          <p className="text-white/60 text-xs mt-1">All transactions are tracked on Solscan</p>
        </div>

        {/* Token Type Selection */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Token Type
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setTokenType('SOL')}
              className={lex-1 py-2 px-4 rounded-lg font-medium transition-all }
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>SOL</span>
              </div>
            </button>
            <button
              onClick={() => setTokenType('GOLD')}
              className={lex-1 py-2 px-4 rounded-lg font-medium transition-all }
            >
              <div className="flex items-center justify-center space-x-2">
                <Coins className="w-4 h-4" />
                <span>GOLD</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Amount
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

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSend}
          disabled={isLoading || !publicKey}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send {tokenType}</span>
            </div>
          )}
        </motion.button>

        {/* Transaction Info */}
        {!publicKey && (
          <div className="text-center text-white/60 text-sm">
            Connect your wallet to send tokens
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SendCard;
