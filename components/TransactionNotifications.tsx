import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { ExternalLink, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { getSolscanUrl } from '../lib/solana';
import { useTransactionHistory } from '../lib/transaction-tracker';

interface Notification {
  id: string;
  signature: string;
  type: 'success' | 'pending' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: number;
  autoHide?: boolean;
}

const TransactionNotifications: React.FC = () => {
  const { connected } = useWallet();
  const transactions = useTransactionHistory();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Monitor transactions and create notifications
  useEffect(() => {
    if (!connected || transactions.length === 0) return;

    const latestTransaction = transactions[0];
    const existingNotification = notifications.find(n => n.signature === latestTransaction.signature);

    if (!existingNotification) {
      // Create notification for new transaction
      const notification: Notification = {
        id: `tx-${latestTransaction.signature}`,
        signature: latestTransaction.signature,
        type: latestTransaction.status === 'confirmed' ? 'success' : 
              latestTransaction.status === 'pending' ? 'pending' : 'error',
        title: getTransactionTitle(latestTransaction.type, latestTransaction.status),
        message: `${latestTransaction.amount} ${latestTransaction.token}`,
        timestamp: latestTransaction.timestamp,
        autoHide: latestTransaction.status === 'confirmed'
      };

      setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep max 5 notifications
    } else if (existingNotification.type !== getNotificationType(latestTransaction.status)) {
      // Update existing notification status
      setNotifications(prev => 
        prev.map(n => 
          n.signature === latestTransaction.signature 
            ? {
                ...n,
                type: getNotificationType(latestTransaction.status),
                title: getTransactionTitle(latestTransaction.type, latestTransaction.status),
                autoHide: latestTransaction.status === 'confirmed'
              }
            : n
        )
      );
    }
  }, [transactions, connected, notifications]);

  // Auto-hide confirmed transactions
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => 
        prev.filter(n => !n.autoHide || Date.now() - n.timestamp < 10000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getNotificationType = (status: string): 'success' | 'pending' | 'error' => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'pending';
      case 'failed': return 'error';
      default: return 'pending';
    }
  };

  const getTransactionTitle = (type: string, status: string): string => {
    const action = type.charAt(0).toUpperCase() + type.slice(1);
    switch (status) {
      case 'confirmed': return `${action} Confirmed`;
      case 'pending': return `${action} Processing`;
      case 'failed': return `${action} Failed`;
      default: return action;
    }
  };

  const getIcon = (type: 'success' | 'pending' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-400 animate-spin" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={20} />;
      default:
        return <CheckCircle className="text-blue-400" size={20} />;
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!connected || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              bg-gradient-to-r p-4 rounded-lg shadow-xl border backdrop-blur-md
              ${notification.type === 'success' ? 'from-green-900/80 to-green-800/80 border-green-500/30' :
                notification.type === 'pending' ? 'from-yellow-900/80 to-yellow-800/80 border-yellow-500/30' :
                notification.type === 'error' ? 'from-red-900/80 to-red-800/80 border-red-500/30' :
                'from-blue-900/80 to-blue-800/80 border-blue-500/30'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold text-sm">
                      {notification.title}
                    </h4>
                  </div>
                  <p className="text-white/80 text-sm mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60 font-mono">
                      {notification.signature.slice(0, 8)}...{notification.signature.slice(-8)}
                    </span>
                    <a
                      href={getSolscanUrl(notification.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-300 hover:text-blue-200 text-xs"
                    >
                      <span>Solscan</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/60 hover:text-white ml-2"
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress bar for pending transactions */}
            {notification.type === 'pending' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 30, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-yellow-400/50 rounded-b-lg"
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionNotifications;