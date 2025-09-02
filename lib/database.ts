import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// User operations
export const createOrUpdateUser = async (walletAddress: string) => {
  return await prisma.user.upsert({
    where: { walletAddress },
    update: { updatedAt: new Date() },
    create: { walletAddress },
  });
};

export const getUserByWallet = async (walletAddress: string) => {
  return await prisma.user.findUnique({
    where: { walletAddress },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 50
      },
      stakingRecords: {
        where: { isActive: true }
      },
      gameResults: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });
};

// Transaction operations
export const createTransaction = async (data: {
  signature: string;
  type: string;
  amount: number;
  token: string;
  fromAddress?: string;
  toAddress?: string;
  status: string;
  fee?: number;
  slot?: number;
  blockTime?: Date;
  userId: string;
}) => {
  return await prisma.transaction.create({
    data
  });
};

export const updateTransactionStatus = async (
  signature: string,
  status: string,
  slot?: number,
  blockTime?: Date
) => {
  return await prisma.transaction.update({
    where: { signature },
    data: {
      status,
      slot,
      blockTime,
      updatedAt: new Date()
    }
  });
};

export const getTransactionsByUser = async (userId: string, limit = 50) => {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  });
};

// Staking operations
export const createStakingRecord = async (data: {
  userAddress: string;
  amount: number;
  apy: number;
  lockPeriod: number;
  userId: string;
}) => {
  return await prisma.stakingRecord.create({
    data: {
      ...data,
      stakingTime: new Date()
    }
  });
};

export const updateStakingRecord = async (
  id: string,
  data: {
    unstakingTime?: Date;
    rewardsClaimed?: number;
    isActive?: boolean;
  }
) => {
  return await prisma.stakingRecord.update({
    where: { id },
    data
  });
};

export const getActiveStakingRecords = async (userId: string) => {
  return await prisma.stakingRecord.findMany({
    where: {
      userId,
      isActive: true
    }
  });
};

// Game operations
export const createGameResult = async (data: {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  category: string;
  rewardAmount: number;
  userId: string;
}) => {
  return await prisma.gameResult.create({
    data
  });
};

export const updateGameReward = async (
  id: string,
  rewardClaimed: boolean,
  nftMinted: boolean
) => {
  return await prisma.gameResult.update({
    where: { id },
    data: {
      rewardClaimed,
      nftMinted
    }
  });
};

// Token price operations
export const updateTokenPrice = async (
  tokenMint: string,
  symbol: string,
  price: number,
  change24h: number = 0,
  volume24h: number = 0
) => {
  return await prisma.tokenPrice.upsert({
    where: { tokenMint },
    update: {
      price,
      change24h,
      volume24h,
      updatedAt: new Date()
    },
    create: {
      tokenMint,
      symbol,
      price,
      change24h,
      volume24h
    }
  });
};

export const getTokenPrice = async (tokenMint: string) => {
  return await prisma.tokenPrice.findUnique({
    where: { tokenMint }
  });
};

// Analytics operations
export const getUserAnalytics = async (userId: string) => {
  const [
    transactionCount,
    totalVolume,
    stakingCount,
    gameCount,
    successfulTransactions
  ] = await Promise.all([
    prisma.transaction.count({ where: { userId } }),
    prisma.transaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    }),
    prisma.stakingRecord.count({ where: { userId } }),
    prisma.gameResult.count({ where: { userId } }),
    prisma.transaction.count({
      where: {
        userId,
        status: 'confirmed'
      }
    })
  ]);

  return {
    totalTransactions: transactionCount,
    totalVolume: totalVolume._sum.amount || 0,
    stakingCount,
    gameCount,
    successRate: transactionCount > 0 ? (successfulTransactions / transactionCount) * 100 : 0
  };
};

// Cleanup old data
export const cleanupOldData = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  await prisma.transaction.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo
      },
      status: 'failed'
    }
  });
};