import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { connection, GOLD_TOKEN_MINT } from './solana';

// Staking program ID - will be set after deployment
export const STAKING_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID || 'YourStakingProgramIdHere'
);

// Pool ID for the main staking pool
export const STAKING_POOL_ID = new BN(1);

export interface StakingPoolData {
  poolId: BN;
  rewardRate: BN;
  lockPeriod: BN;
  totalStaked: BN;
  totalRewards: BN;
  authority: PublicKey;
  tokenMint: PublicKey;
  bump: number;
}

export interface UserStakeData {
  user: PublicKey;
  amount: BN;
  stakeTime: BN;
  rewardsClaimed: BN;
  bump: number;
}

// Get staking pool PDA
export const getStakingPoolPDA = (poolId: BN): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('staking_pool'),
      poolId.toArrayLike(Buffer, 'le', 8)
    ],
    STAKING_PROGRAM_ID
  );
};

// Get user stake PDA
export const getUserStakePDA = (user: PublicKey, stakingPool: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('user_stake'),
      user.toBuffer(),
      stakingPool.toBuffer()
    ],
    STAKING_PROGRAM_ID
  );
};

// Get staking pool data
export const getStakingPoolData = async (): Promise<StakingPoolData | null> => {
  try {
    const [stakingPoolPDA] = getStakingPoolPDA(STAKING_POOL_ID);
    const accountInfo = await connection.getAccountInfo(stakingPoolPDA);
    
    if (!accountInfo) {
      return null;
    }

    // Parse the account data (simplified - in real implementation you'd use the IDL)
    // This is a mock structure for now
    return {
      poolId: STAKING_POOL_ID,
      rewardRate: new BN(125), // 12.5% APY
      lockPeriod: new BN(30 * 24 * 60 * 60), // 30 days in seconds
      totalStaked: new BN(1250000),
      totalRewards: new BN(50000),
      authority: new PublicKey('11111111111111111111111111111111'),
      tokenMint: GOLD_TOKEN_MINT,
      bump: 255
    };
  } catch (error) {
    console.error('Error fetching staking pool data:', error);
    return null;
  }
};

// Get user stake data
export const getUserStakeData = async (userPubkey: PublicKey): Promise<UserStakeData | null> => {
  try {
    const [stakingPoolPDA] = getStakingPoolPDA(STAKING_POOL_ID);
    const [userStakePDA] = getUserStakePDA(userPubkey, stakingPoolPDA);
    
    const accountInfo = await connection.getAccountInfo(userStakePDA);
    
    if (!accountInfo) {
      return null;
    }

    // Parse the account data (simplified - in real implementation you'd use the IDL)
    // This is a mock structure for now
    return {
      user: userPubkey,
      amount: new BN(1000),
      stakeTime: new BN(Date.now() / 1000 - 7 * 24 * 60 * 60), // 7 days ago
      rewardsClaimed: new BN(0),
      bump: 255
    };
  } catch (error) {
    console.error('Error fetching user stake data:', error);
    return null;
  }
};

// Calculate pending rewards
export const calculatePendingRewards = (
  userStake: UserStakeData,
  stakingPool: StakingPoolData
): number => {
  const currentTime = Math.floor(Date.now() / 1000);
  const stakingDuration = currentTime - userStake.stakeTime.toNumber();
  
  // Calculate rewards based on APY
  const secondsInYear = 365 * 24 * 60 * 60;
  const rewardRate = stakingPool.rewardRate.toNumber() / 1000; // Convert to percentage
  
  const rewards = (userStake.amount.toNumber() * rewardRate * stakingDuration) / secondsInYear;
  const claimableRewards = Math.max(0, rewards - userStake.rewardsClaimed.toNumber());
  
  return claimableRewards;
};

// Create stake transaction (simplified - would use Anchor in real implementation)
export const createStakeTransaction = async (
  userPubkey: PublicKey,
  amount: number
): Promise<Transaction> => {
  const [stakingPoolPDA] = getStakingPoolPDA(STAKING_POOL_ID);
  const [userStakePDA] = getUserStakePDA(userPubkey, stakingPoolPDA);
  
  const userTokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, userPubkey);
  const poolTokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, stakingPoolPDA, true);

  const transaction = new Transaction();
  
  // In a real implementation, this would create the proper Anchor instruction
  // For now, this is a placeholder that would need to be replaced with actual Anchor integration
  
  return transaction;
};

// Create unstake transaction (simplified)
export const createUnstakeTransaction = async (
  userPubkey: PublicKey
): Promise<Transaction> => {
  const [stakingPoolPDA] = getStakingPoolPDA(STAKING_POOL_ID);
  const [userStakePDA] = getUserStakePDA(userPubkey, stakingPoolPDA);
  
  const transaction = new Transaction();
  
  // In a real implementation, this would create the proper Anchor instruction
  // For now, this is a placeholder that would need to be replaced with actual Anchor integration
  
  return transaction;
};

// Create claim rewards transaction (simplified)
export const createClaimRewardsTransaction = async (
  userPubkey: PublicKey
): Promise<Transaction> => {
  const [stakingPoolPDA] = getStakingPoolPDA(STAKING_POOL_ID);
  const [userStakePDA] = getUserStakePDA(userPubkey, stakingPoolPDA);
  
  const transaction = new Transaction();
  
  // In a real implementation, this would create the proper Anchor instruction
  // For now, this is a placeholder that would need to be replaced with actual Anchor integration
  
  return transaction;
};