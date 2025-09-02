import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { 
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID 
} from '@metaplex-foundation/mpl-token-metadata';
import { 
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress
} from '@solana/spl-token';

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { 
        walletAddress,
        gameScore,
        category,
        achievementType = 'perfect_score'
      } = req.body;
      
      if (!walletAddress || gameScore === undefined) {
        return res.status(400).json({ 
          error: 'Missing required parameters: walletAddress, gameScore' 
        });
      }

      // Verify wallet address
      let userPublicKey: PublicKey;
      try {
        userPublicKey = new PublicKey(walletAddress);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }

      // Create NFT metadata based on achievement
      const metadata = {
        name: `Goldium ${achievementType.replace('_', ' ').toUpperCase()} Achievement`,
        symbol: 'GOLDIUM',
        description: `Congratulations! You achieved ${achievementType.replace('_', ' ')} in Goldium DeFi Game with a score of ${gameScore}.`,
        image: `https://your-domain.vercel.app/nft/achievement_${achievementType}.png`,
        attributes: [
          { trait_type: 'Achievement', value: achievementType.replace('_', ' ') },
          { trait_type: 'Score', value: gameScore.toString() },
          { trait_type: 'Category', value: category || 'mixed' },
          { trait_type: 'Date', value: new Date().toISOString().split('T')[0] },
          { trait_type: 'Network', value: 'Solana Mainnet' }
        ],
        properties: {
          files: [
            {
              uri: `https://your-domain.vercel.app/nft/achievement_${achievementType}.png`,
              type: 'image/png'
            }
          ],
          category: 'image'
        }
      };

      // In production, this would:
      // 1. Upload metadata to IPFS/Arweave
      // 2. Create mint account
      // 3. Create metadata account
      // 4. Mint NFT to user
      
      // For now, return mock NFT data
      const mockMintAddress = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockSignature = `mint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      res.status(200).json({
        success: true,
        nft: {
          mintAddress: mockMintAddress,
          metadata,
          signature: mockSignature,
          solscanUrl: `https://solscan.io/tx/${mockSignature}`,
          explorerUrl: `https://solscan.io/token/${mockMintAddress}`
        },
        message: 'NFT reward minted successfully!'
      });
    } catch (error) {
      console.error('NFT minting error:', error);
      res.status(500).json({ 
        error: 'Failed to mint NFT reward',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}