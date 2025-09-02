// Simple storage solution for development/demo
// This can work without external database

export interface SimpleUser {
  walletAddress: string;
  totalTransactions: number;
  totalVolume: number;
  gameScore: number;
  gamesPlayed: number;
  nftRewards: number;
  lessonsCompleted: number;
  createdAt: string;
}

export interface SimpleTransaction {
  signature: string;
  type: string;
  amount: number;
  token: string;
  fromAddress?: string;
  toAddress?: string;
  status: string;
  timestamp: string;
  walletAddress: string;
}

// In-memory storage for demo (in production, use Redis/KV store)
const users = new Map<string, SimpleUser>();
const transactions = new Map<string, SimpleTransaction>();

// User operations
export const createOrUpdateUser = async (walletAddress: string): Promise<SimpleUser> => {
  const existing = users.get(walletAddress);
  
  if (existing) {
    return existing;
  }

  const newUser: SimpleUser = {
    walletAddress,
    totalTransactions: 0,
    totalVolume: 0,
    gameScore: 0,
    gamesPlayed: 0,
    nftRewards: 0,
    lessonsCompleted: 0,
    createdAt: new Date().toISOString()
  };

  users.set(walletAddress, newUser);
  return newUser;
};

export const getUserByWallet = async (walletAddress: string): Promise<SimpleUser | null> => {
  return users.get(walletAddress) || null;
};

export const updateUserStats = async (
  walletAddress: string,
  updates: Partial<SimpleUser>
): Promise<SimpleUser | null> => {
  const user = users.get(walletAddress);
  if (!user) return null;

  const updatedUser = { ...user, ...updates };
  users.set(walletAddress, updatedUser);
  return updatedUser;
};

// Transaction operations
export const createTransaction = async (transaction: Omit<SimpleTransaction, 'timestamp'>): Promise<SimpleTransaction> => {
  const fullTransaction: SimpleTransaction = {
    ...transaction,
    timestamp: new Date().toISOString()
  };

  transactions.set(transaction.signature, fullTransaction);
  
  // Update user transaction count
  const user = users.get(transaction.walletAddress);
  if (user) {
    user.totalTransactions++;
    user.totalVolume += transaction.amount;
    users.set(transaction.walletAddress, user);
  }

  return fullTransaction;
};

export const getTransactionsByWallet = async (walletAddress: string): Promise<SimpleTransaction[]> => {
  return Array.from(transactions.values())
    .filter(tx => tx.walletAddress === walletAddress)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const updateTransactionStatus = async (
  signature: string,
  status: string
): Promise<SimpleTransaction | null> => {
  const transaction = transactions.get(signature);
  if (!transaction) return null;

  transaction.status = status;
  transactions.set(signature, transaction);
  return transaction;
};

// Game operations
export const recordGameResult = async (
  walletAddress: string,
  score: number,
  totalQuestions: number,
  timeSpent: number
): Promise<{ rewardAmount: number; nftEligible: boolean }> => {
  const user = users.get(walletAddress);
  if (!user) {
    await createOrUpdateUser(walletAddress);
  }

  const scorePercentage = (score / totalQuestions) * 100;
  let rewardAmount = 0;
  let nftEligible = false;

  if (scorePercentage >= 90) {
    rewardAmount = 100;
    nftEligible = true;
  } else if (scorePercentage >= 80) {
    rewardAmount = 50;
  } else if (scorePercentage >= 60) {
    rewardAmount = 25;
  } else if (scorePercentage >= 40) {
    rewardAmount = 10;
  }

  // Update user stats
  await updateUserStats(walletAddress, {
    gameScore: Math.max(user?.gameScore || 0, score),
    gamesPlayed: (user?.gamesPlayed || 0) + 1,
    nftRewards: nftEligible ? (user?.nftRewards || 0) + 1 : (user?.nftRewards || 0)
  });

  return { rewardAmount, nftEligible };
};

// Analytics
export const getUserAnalytics = async (walletAddress: string) => {
  const user = users.get(walletAddress);
  const userTransactions = await getTransactionsByWallet(walletAddress);
  
  const successfulTxs = userTransactions.filter(tx => tx.status === 'confirmed');
  const successRate = userTransactions.length > 0 ? (successfulTxs.length / userTransactions.length) * 100 : 0;

  return {
    user: user || null,
    totalTransactions: userTransactions.length,
    totalVolume: user?.totalVolume || 0,
    successRate,
    recentTransactions: userTransactions.slice(0, 10)
  };
};