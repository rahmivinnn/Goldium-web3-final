import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SendCard from '../components/SendCard';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { getSolscanUrl } from '../lib/solana';

const SendPage: React.FC = () => {
  const [lastTransaction, setLastTransaction] = useState<string | null>(null);

  const handleTransactionComplete = (signature: string) => {
    setLastTransaction(signature);
  };

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
              Send Tokens
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Send SOL or GOLD tokens to any Solana address with real on-chain transactions
            </p>
          </motion.div>

          <div className="flex justify-center">
            <SendCard onTransactionComplete={handleTransactionComplete} />
          </div>

          {/* Transaction Success */}
          {lastTransaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mt-8"
            >
              <div className="card bg-green-500/10 border-green-500/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-400">Transaction Successful!</h3>
                    <p className="text-sm text-white/70">Your tokens have been sent successfully.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href={getSolscanUrl(lastTransaction)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>View on Solscan</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold gradient-text text-center mb-12">
              Why Choose Goldium?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Real Transactions</h3>
                <p className="text-white/70">All transactions are executed on Solana Mainnet and tracked on Solscan</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fast & Secure</h3>
                <p className="text-white/70">Lightning-fast transactions with minimal fees on Solana Mainnet</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transparent</h3>
                <p className="text-white/70">Every transaction is publicly verifiable on Solscan explorer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SendPage;
