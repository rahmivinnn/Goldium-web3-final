import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { getSolscanUrl, getTransactionDetails } from './solana';
import toast from 'react-hot-toast';

export interface TransactionRecord {
  signature: string;
  type: 'send' | 'swap' | 'stake' | 'unstake' | 'claim';
  amount: number;
  token: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  fromAddress?: string;
  toAddress?: string;
  details?: any;
}

// Transaction storage key
const TRANSACTIONS_STORAGE_KEY = 'goldium_transactions';

// Get stored transactions
export const getStoredTransactions = (): TransactionRecord[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading stored transactions:', error);
    return [];
  }
};

// Store transaction
export const storeTransaction = (transaction: TransactionRecord): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = getStoredTransactions();
    const updated = [transaction, ...existing].slice(0, 100); // Keep last 100 transactions
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error storing transaction:', error);
  }
};

// Update transaction status
export const updateTransactionStatus = (signature: string, status: 'confirmed' | 'failed', details?: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const transactions = getStoredTransactions();
    const updated = transactions.map(tx => 
      tx.signature === signature 
        ? { ...tx, status, details: details || tx.details }
        : tx
    );
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating transaction status:', error);
  }
};

// Track transaction with comprehensive Solscan integration
export const trackTransaction = async (
  signature: string,
  type: TransactionRecord['type'],
  amount: number,
  token: string,
  userAddress?: string,
  recipientAddress?: string
): Promise<void> => {
  // Create transaction record
  const transaction: TransactionRecord = {
    signature,
    type,
    amount,
    token,
    timestamp: Date.now(),
    status: 'pending',
    fromAddress: userAddress,
    toAddress: recipientAddress,
  };

  // Store transaction immediately
  storeTransaction(transaction);

  // Show immediate notification with Solscan link
  const solscanUrl = getSolscanUrl(signature);
  
  toast.success(
    React.createElement('div', { className: "flex flex-col space-y-2" }, [
      React.createElement('div', { key: 'header', className: "flex items-center space-x-2" }, [
        React.createElement('span', { key: 'icon', className: "text-green-400" }, '✅'),
        React.createElement('span', { key: 'text', className: "font-semibold" }, 'Transaction Submitted')
      ]),
      React.createElement('div', { key: 'desc', className: "text-sm text-gray-300" }, 
        getTransactionDescription(type, amount, token)
      ),
      React.createElement('a', {
        key: 'link',
        href: solscanUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-blue-400 hover:text-blue-300 underline text-sm flex items-center space-x-1"
      }, [
        React.createElement('span', { key: 'linktext' }, '📊 Track on Solscan'),
        React.createElement('span', { key: 'arrow' }, '↗')
      ])
    ]),
    { 
      duration: 8000,
      id: `tx-${signature}` // Prevent duplicate toasts
    }
  );

  // Monitor transaction status
  monitorTransactionStatus(signature, type, amount, token);
};

// Monitor transaction status and update accordingly
const monitorTransactionStatus = async (
  signature: string,
  type: TransactionRecord['type'],
  amount: number,
  token: string
): Promise<void> => {
  let attempts = 0;
  const maxAttempts = 30; // Monitor for up to 30 attempts (about 2 minutes)

  const checkStatus = async () => {
    try {
      attempts++;
      
      // Get transaction details from Solscan
      const details = await getTransactionDetails(signature);
      
      if (details) {
        // Transaction confirmed
        updateTransactionStatus(signature, 'confirmed', details);
        
        toast.success(
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">🎉</span>
              <span className="font-semibold">Transaction Confirmed!</span>
            </div>
            <div className="text-sm text-gray-300">
              {getTransactionDescription(type, amount, token)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Block: {details.slot || 'N/A'}
              </span>
              <a 
                href={getSolscanUrl(signature)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-xs"
              >
                View Details 📊
              </a>
            </div>
          </div>,
          { 
            duration: 10000,
            id: `confirmed-${signature}`
          }
        );
        return;
      }
      
      // Continue monitoring if not confirmed and haven't exceeded max attempts
      if (attempts < maxAttempts) {
        setTimeout(checkStatus, 4000); // Check every 4 seconds
      } else {
        // Transaction might have failed or taking too long
        updateTransactionStatus(signature, 'failed');
        toast.error(
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-red-400">⚠️</span>
              <span className="font-semibold">Transaction Status Unknown</span>
            </div>
            <div className="text-sm text-gray-300">
              Please check Solscan for transaction status
            </div>
            <a 
              href={getSolscanUrl(signature)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline text-sm"
            >
              Check on Solscan 📊
            </a>
          </div>,
          { duration: 8000 }
        );
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
      if (attempts < maxAttempts) {
        setTimeout(checkStatus, 4000);
      }
    }
  };

  // Start monitoring after a short delay
  setTimeout(checkStatus, 2000);
};

// Get human-readable transaction description
const getTransactionDescription = (
  type: TransactionRecord['type'],
  amount: number,
  token: string
): string => {
  switch (type) {
    case 'send':
      return `Sent ${amount} ${token}`;
    case 'swap':
      return `Swapped ${amount} ${token}`;
    case 'stake':
      return `Staked ${amount} ${token}`;
    case 'unstake':
      return `Unstaked ${amount} ${token}`;
    case 'claim':
      return `Claimed ${amount} ${token} rewards`;
    default:
      return `${type} transaction`;
  }
};

// Enhanced Solscan notification with rich information
export const showSolscanNotification = (
  signature: string,
  type: TransactionRecord['type'],
  amount: number,
  token: string,
  additionalInfo?: string
): void => {
  const solscanUrl = getSolscanUrl(signature);
  
  toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg border border-gold-400/30 shadow-xl max-w-md"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gold-400/20 rounded-full flex items-center justify-center">
              <span className="text-gold-400 text-sm">📊</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">
                Solscan Tracking
              </h3>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-2">
              {getTransactionDescription(type, amount, token)}
            </p>
            {additionalInfo && (
              <p className="text-gray-400 text-xs mb-2">{additionalInfo}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">
                {signature.slice(0, 8)}...{signature.slice(-8)}
              </span>
              <a
                href={solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500/20 hover:bg-gold-500/30 text-gold-400 px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                View on Solscan ↗
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    { 
      duration: 12000,
      position: 'top-right'
    }
  );
};

// Transaction history hook
export const useTransactionHistory = () => {
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>([]);

  React.useEffect(() => {
    setTransactions(getStoredTransactions());
    
    // Listen for storage changes
    const handleStorageChange = () => {
      setTransactions(getStoredTransactions());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return transactions;
};