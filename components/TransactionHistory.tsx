import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ExternalLink, Filter, Search, Calendar } from 'lucide-react';
import { useTransactionHistory, TransactionRecord } from '../lib/transaction-tracker';
import { getSolscanUrl } from '../lib/solana';

const TransactionHistory: React.FC = () => {
  const transactions = useTransactionHistory();
  const [filter, setFilter] = useState<'all' | 'send' | 'swap' | 'stake' | 'unstake' | 'claim'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch = searchTerm === '' || 
      tx.signature.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: TransactionRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-green-400">✅</span>;
      case 'pending':
        return <span className="text-yellow-400">⏳</span>;
      case 'failed':
        return <span className="text-red-400">❌</span>;
      default:
        return <span className="text-gray-400">❓</span>;
    }
  };

  const getTypeIcon = (type: TransactionRecord['type']) => {
    switch (type) {
      case 'send':
        return <span className="text-blue-400">📤</span>;
      case 'swap':
        return <span className="text-purple-400">🔄</span>;
      case 'stake':
        return <span className="text-green-400">🏦</span>;
      case 'unstake':
        return <span className="text-orange-400">🏃</span>;
      case 'claim':
        return <span className="text-yellow-400">🎁</span>;
      default:
        return <span className="text-gray-400">📋</span>;
    }
  };

  const formatAmount = (amount: number, token: string) => {
    return `${amount.toLocaleString()} ${token}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <>
      {/* Floating Transaction History Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white p-4 rounded-full shadow-lg hover:shadow-gold-500/25 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <History size={24} />
        {transactions.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
          >
            {transactions.length > 99 ? '99+' : transactions.length}
          </motion.div>
        )}
      </motion.button>

      {/* Transaction History Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <History className="text-gold-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                  <span className="bg-gold-400/20 text-gold-400 px-3 py-1 rounded-full text-sm">
                    {transactions.length} transactions
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold-500/50"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-400" size={16} />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-gold-500/50"
                  >
                    <option value="all">All Types</option>
                    <option value="send">Send</option>
                    <option value="swap">Swap</option>
                    <option value="stake">Stake</option>
                    <option value="unstake">Unstake</option>
                    <option value="claim">Claim</option>
                  </select>
                </div>
              </div>

              {/* Transaction List */}
              <div className="overflow-y-auto max-h-96 space-y-3">
                <AnimatePresence>
                  {filteredTransactions.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-gray-400"
                    >
                      <History size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      {searchTerm && (
                        <p className="text-sm mt-2">Try adjusting your search or filter</p>
                      )}
                    </motion.div>
                  ) : (
                    filteredTransactions.map((tx, index) => (
                      <motion.div
                        key={tx.signature}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-gold-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(tx.type)}
                              {getStatusIcon(tx.status)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium capitalize">
                                  {tx.type}
                                </span>
                                <span className="text-gold-400 font-semibold">
                                  {formatAmount(tx.amount, tx.token)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 flex items-center space-x-2">
                                <Calendar size={12} />
                                <span>{formatDate(tx.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 font-mono hidden sm:block">
                              {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                            </span>
                            <a
                              href={getSolscanUrl(tx.signature)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-colors"
                              title="View on Solscan"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>

                        {/* Additional transaction details */}
                        {(tx.fromAddress || tx.toAddress) && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="text-xs text-gray-400 space-y-1">
                              {tx.fromAddress && (
                                <div>From: {tx.fromAddress.slice(0, 8)}...{tx.fromAddress.slice(-8)}</div>
                              )}
                              {tx.toAddress && (
                                <div>To: {tx.toAddress.slice(0, 8)}...{tx.toAddress.slice(-8)}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm">
                  All transactions are tracked on{' '}
                  <a
                    href="https://solscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Solscan.io
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TransactionHistory;