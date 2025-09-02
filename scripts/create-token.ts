import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createSetAuthorityInstruction,
  AuthorityType
} from '@solana/spl-token';
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
import fs from 'fs';
import path from 'path';

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

async function createGoldToken() {
  console.log('🪙 Creating GOLD Token on Solana Mainnet...');
  
  // Load or create payer keypair
  const payerKeypairPath = path.join(process.cwd(), 'keypairs', 'payer.json');
  let payerKeypair: Keypair;
  
  if (fs.existsSync(payerKeypairPath)) {
    const keypairData = JSON.parse(fs.readFileSync(payerKeypairPath, 'utf8'));
    payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log('📂 Loaded existing payer keypair');
  } else {
    payerKeypair = Keypair.generate();
    fs.mkdirSync(path.dirname(payerKeypairPath), { recursive: true });
    fs.writeFileSync(payerKeypairPath, JSON.stringify(Array.from(payerKeypair.secretKey)));
    console.log('🔑 Generated new payer keypair');
    console.log('💰 Payer address:', payerKeypair.publicKey.toString());
    console.log('⚠️  Please fund this address with SOL before continuing!');
    return;
  }

  // Check payer balance
  const balance = await connection.getBalance(payerKeypair.publicKey);
  console.log('💰 Payer balance:', balance / 1e9, 'SOL');
  
  if (balance < 0.1 * 1e9) {
    console.log('❌ Insufficient balance. Please fund the payer account with at least 0.1 SOL');
    return;
  }

  // Create mint keypair
  const mintKeypair = Keypair.generate();
  console.log('🪙 Token mint address:', mintKeypair.publicKey.toString());

  // Get minimum rent for mint account
  const mintRent = await getMinimumBalanceForRentExemptMint(connection);

  // Token metadata
  const tokenMetadata = {
    name: 'Goldium',
    symbol: 'GOLD',
    description: 'The native token of Goldium DeFi ecosystem on Solana',
    image: 'https://your-domain.vercel.app/token/gold-logo.png',
    external_url: 'https://goldium-defi.vercel.app',
    attributes: [
      { trait_type: 'Type', value: 'Utility Token' },
      { trait_type: 'Network', value: 'Solana' },
      { trait_type: 'Standard', value: 'SPL Token' }
    ]
  };

  // Create metadata PDA
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );

  // Get associated token account for payer
  const payerTokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    payerKeypair.publicKey
  );

  // Create transaction
  const transaction = new Transaction().add(
    // Create mint account
    SystemProgram.createAccount({
      fromPubkey: payerKeypair.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID,
    }),
    
    // Initialize mint
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      6, // 6 decimals
      payerKeypair.publicKey,
      payerKeypair.publicKey,
      TOKEN_PROGRAM_ID
    ),

    // Create associated token account
    createAssociatedTokenAccountInstruction(
      payerKeypair.publicKey,
      payerTokenAccount,
      payerKeypair.publicKey,
      mintKeypair.publicKey
    ),

    // Mint initial supply (1 billion tokens)
    createMintToInstruction(
      mintKeypair.publicKey,
      payerTokenAccount,
      payerKeypair.publicKey,
      1_000_000_000 * 1e6 // 1 billion tokens with 6 decimals
    ),

    // Create metadata account
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: mintKeypair.publicKey,
        mintAuthority: payerKeypair.publicKey,
        payer: payerKeypair.publicKey,
        updateAuthority: payerKeypair.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: tokenMetadata.name,
            symbol: tokenMetadata.symbol,
            uri: '', // In production, upload metadata to IPFS/Arweave
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    )
  );

  try {
    console.log('📝 Sending transaction...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeypair, mintKeypair],
      { commitment: 'confirmed' }
    );

    console.log('✅ GOLD Token created successfully!');
    console.log('🪙 Token Mint:', mintKeypair.publicKey.toString());
    console.log('📊 Solscan:', `https://solscan.io/token/${mintKeypair.publicKey.toString()}`);
    console.log('🔗 Transaction:', `https://solscan.io/tx/${signature}`);

    // Save token info
    const tokenInfo = {
      mintAddress: mintKeypair.publicKey.toString(),
      symbol: tokenMetadata.symbol,
      name: tokenMetadata.name,
      decimals: 6,
      supply: 1_000_000_000,
      createdAt: new Date().toISOString(),
      signature,
      metadata: tokenMetadata
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'token-info.json'),
      JSON.stringify(tokenInfo, null, 2)
    );

    console.log('💾 Token info saved to token-info.json');
    console.log('📝 Update your .env.local with:');
    console.log(`NEXT_PUBLIC_GOLD_TOKEN_MINT=${mintKeypair.publicKey.toString()}`);

  } catch (error) {
    console.error('❌ Error creating token:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  createGoldToken()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default createGoldToken;