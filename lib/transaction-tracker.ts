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
    const updated = [transaction, ...existing].slice(0, 100);
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

  storeTransaction(transaction);

  const solscanUrl = getSolscanUrl(signature);
  
  toast.success(
    `Transaction submitted! Track on Solscan: ${solscanUrl}`,
    { 
      duration: 8000,
      id: `tx-${signature}`
    }
  );

  monitorTransactionStatus(signature, type, amount, token);
};

// Monitor transaction status
const monitorTransactionStatus = async (
  signature: string,
  type: TransactionRecord['type'],
  amount: number,
  token: string
): Promise<void> => {
  let attempts = 0;
  const maxAttempts = 30;

  const checkStatus = async () => {
    try {
      attempts++;
      
      const details = await getTransactionDetails(signature);
      
      if (details) {
        updateTransactionStatus(signature, 'confirmed', details);
        
        toast.success(
          `Transaction confirmed! ${getTransactionDescription(type, amount, token)}`,
          { 
            duration: 10000,
            id: `confirmed-${signature}`
          }
        );
        return;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkStatus, 4000);
      } else {
        updateTransactionStatus(signature, 'failed');
        toast.error(
          `Transaction status unknown. Check Solscan: ${getSolscanUrl(signature)}`,
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

// Enhanced Solscan notification
export const showSolscanNotification = (
  signature: string,
  type: TransactionRecord['type'],
  amount: number,
  token: string,
  additionalInfo?: string
): void => {
  const solscanUrl = getSolscanUrl(signature);
  const description = getTransactionDescription(type, amount, token);
  
  toast.success(
    `${description} - View on Solscan: ${solscanUrl} ${additionalInfo ? `(${additionalInfo})` : ''}`,
    { duration: 12000 }
  );
};

// Transaction history hook
export const useTransactionHistory = () => {
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>([]);

  React.useEffect(() => {
    setTransactions(getStoredTransactions());
    
    const handleStorageChange = () => {
      setTransactions(getStoredTransactions());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  return transactions;
};