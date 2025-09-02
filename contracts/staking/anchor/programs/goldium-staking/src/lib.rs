use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("YourStakingProgramIdHere");

#[program]
pub mod goldium_staking {
    use super::*;

    pub fn initialize_staking_pool(
        ctx: Context<InitializeStakingPool>,
        pool_id: u64,
        reward_rate: u64,
        lock_period: i64,
    ) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        staking_pool.pool_id = pool_id;
        staking_pool.reward_rate = reward_rate;
        staking_pool.lock_period = lock_period;
        staking_pool.total_staked = 0;
        staking_pool.total_rewards = 0;
        staking_pool.authority = ctx.accounts.authority.key();
        staking_pool.token_mint = ctx.accounts.token_mint.key();
        staking_pool.bump = ctx.bumps.staking_pool;
        
        Ok(())
    }

    pub fn stake_tokens(
        ctx: Context<StakeTokens>,
        amount: u64,
    ) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Transfer tokens from user to staking pool
        let transfer_instruction = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
        );
        
        token::transfer(cpi_ctx, amount)?;
        
        // Update user stake info
        user_stake.user = ctx.accounts.user.key();
        user_stake.amount = amount;
        user_stake.stake_time = Clock::get()?.unix_timestamp;
        user_stake.rewards_claimed = 0;
        user_stake.bump = ctx.bumps.user_stake;
        
        // Update pool info
        staking_pool.total_staked += amount;
        
        Ok(())
    }

    pub fn unstake_tokens(
        ctx: Context<UnstakeTokens>,
    ) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Check if lock period has passed
        let current_time = Clock::get()?.unix_timestamp;
        require!(
            current_time >= user_stake.stake_time + staking_pool.lock_period,
            ErrorCode::LockPeriodNotReached
        );
        
        // Transfer tokens back to user
        let seeds = &[
            b"staking_pool",
            staking_pool.pool_id.to_le_bytes().as_ref(),
            &[staking_pool.bump],
        ];
        let signer = &[&seeds[..]];
        
        let transfer_instruction = Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.staking_pool.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            signer,
        );
        
        token::transfer(cpi_ctx, user_stake.amount)?;
        
        // Update pool info
        staking_pool.total_staked -= user_stake.amount;
        
        // Reset user stake
        user_stake.amount = 0;
        user_stake.stake_time = 0;
        
        Ok(())
    }

    pub fn claim_rewards(
        ctx: Context<ClaimRewards>,
    ) -> Result<()> {
        let staking_pool = &mut ctx.accounts.staking_pool;
        let user_stake = &mut ctx.accounts.user_stake;
        
        // Calculate rewards
        let current_time = Clock::get()?.unix_timestamp;
        let staking_duration = current_time - user_stake.stake_time;
        let rewards = (user_stake.amount as u128)
            .checked_mul(staking_pool.reward_rate as u128)
            .unwrap()
            .checked_div(365 * 24 * 60 * 60) // Per second rate
            .unwrap()
            .checked_mul(staking_duration as u128)
            .unwrap()
            .checked_div(1_000_000) // Adjust for precision
            .unwrap() as u64;
        
        let claimable_rewards = rewards - user_stake.rewards_claimed;
        
        require!(claimable_rewards > 0, ErrorCode::NoRewardsToClaim);
        
        // Transfer rewards to user
        let seeds = &[
            b"staking_pool",
            staking_pool.pool_id.to_le_bytes().as_ref(),
            &[staking_pool.bump],
        ];
        let signer = &[&seeds[..]];
        
        let transfer_instruction = Transfer {
            from: ctx.accounts.pool_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.staking_pool.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            transfer_instruction,
            signer,
        );
        
        token::transfer(cpi_ctx, claimable_rewards)?;
        
        // Update user stake info
        user_stake.rewards_claimed += claimable_rewards;
        staking_pool.total_rewards += claimable_rewards;
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(pool_id: u64)]
pub struct InitializeStakingPool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StakingPool::INIT_SPACE,
        seeds = [b"staking_pool", pool_id.to_le_bytes().as_ref()],
        bump
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub token_mint: Account<'info, token::Mint>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"staking_pool", staking_pool.pool_id.to_le_bytes().as_ref()],
        bump = staking_pool.bump
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserStake::INIT_SPACE,
        seeds = [b"user_stake", user.key().as_ref(), staking_pool.key().as_ref()],
        bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"staking_pool", staking_pool.pool_id.to_le_bytes().as_ref()],
        bump = staking_pool.bump
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user_stake", user.key().as_ref(), staking_pool.key().as_ref()],
        bump = user_stake.bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        mut,
        seeds = [b"staking_pool", staking_pool.pool_id.to_le_bytes().as_ref()],
        bump = staking_pool.bump
    )]
    pub staking_pool: Account<'info, StakingPool>,
    
    #[account(
        mut,
        seeds = [b"user_stake", user.key().as_ref(), staking_pool.key().as_ref()],
        bump = user_stake.bump
    )]
    pub user_stake: Account<'info, UserStake>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct StakingPool {
    pub pool_id: u64,
    pub reward_rate: u64,
    pub lock_period: i64,
    pub total_staked: u64,
    pub total_rewards: u64,
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct UserStake {
    pub user: Pubkey,
    pub amount: u64,
    pub stake_time: i64,
    pub rewards_claimed: u64,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Lock period not reached")]
    LockPeriodNotReached,
    #[msg("No rewards to claim")]
    NoRewardsToClaim,
}
