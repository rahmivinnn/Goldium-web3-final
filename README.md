# Goldium - Complete DeFi Application on Solana Mainnet

A production-grade, interactive Web3 DeFi application built on Solana Mainnet, featuring real on-chain transactions for SOL  GOLD token operations, staking, and educational content.

##  Features

###  Phase 1: Infrastructure & Wallet Connection
- **Wallet Integration**: Support for Phantom and Solflare wallets
- **Real Balance Display**: Live SOL and GOLD token balance fetching from Mainnet
- **Responsive UI**: Futuristic design with glass morphism effects
- **State Management**: Zustand store for wallet and application state
- **TypeScript**: Full TypeScript support with proper types
- **Tailwind CSS**: Custom design system with gold/solana theme
- **Framer Motion**: Smooth animations and interactions

###  Phase 2: Send & Swap Functionality
- **Send Tokens**: Send SOL and GOLD tokens with real on-chain transactions
- **Token Swapping**: Swap between SOL and GOLD using Jupiter API integration
- **Transaction Confirmation**: Real-time transaction status and confirmation
- **Price Display**: Live market data and price information
- **Slippage Control**: Customizable slippage tolerance settings
- **Solscan Integration**: All transactions tracked on Solscan explorer

###  Phase 3: Staking Smart Contract & UI
- **Staking Pool**: Stake GOLD tokens and earn rewards
- **Smart Contract**: Anchor-based staking contract with reward calculation
- **APY Display**: Real-time staking rewards and APY information
- **Claim Rewards**: Claim earned rewards anytime
- **Unstaking**: Unstake tokens after lock period
- **Mainnet Deployment**: All staking operations on Solana Mainnet

###  Phase 4: Educational Game
- **Interactive Quiz**: Test Solana knowledge with timed questions
- **Multiple Categories**: Basics, Technology, Tokens, Economics
- **Reward System**: Earn NFT rewards for high scores
- **Progress Tracking**: Track learning progress and achievements
- **Real-time Feedback**: Immediate explanations for each answer

###  Phase 5: Learn Section
- **Interactive Lessons**: Comprehensive Solana blockchain education
- **Progress Tracking**: Track completion of learning modules
- **Category-based Learning**: Organized by topics (Basics, Technology, etc.)
- **Resource Links**: Links to official documentation and resources

##  Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Zustand**: State management
- **Lucide React**: Icon library

### Blockchain
- **Solana Web3.js**: Solana blockchain interaction
- **Solana Wallet Adapter**: Wallet connection
- **Anchor Framework**: Smart contract development
- **SPL Token**: Token operations
- **Jupiter API**: Token swapping
- **Solscan Integration**: Transaction tracking

### Smart Contracts
- **Rust**: Smart contract language
- **Anchor**: Solana program framework
- **SPL Token Program**: Token standard implementation

##  Project Structure

`
 components/              # React components
    Navbar.tsx          # Navigation bar
    WalletConnect.tsx   # Wallet connection
    SendCard.tsx        # Send tokens
    SwapCard.tsx        # Token swapping
    StakeCard.tsx       # Staking interface
    GameUI.tsx          # Educational game
    LearnCard.tsx       # Learning modules
 lib/                    # Utility functions
    solana.ts          # Solana connection utilities
    wallet-context.tsx # Wallet provider
    store.ts           # State management
 pages/                  # Next.js pages
    index.tsx          # Homepage
    send.tsx           # Send page
    swap.tsx           # Swap page
    stake.tsx          # Staking page
    game.tsx           # Game page
    learn.tsx          # Learn page
 styles/                 # Global styles
    globals.css        # Tailwind and custom styles
 contracts/              # Smart contracts
    staking/           # Staking contract
        anchor/        # Anchor project
 game/                   # Game logic
`

##  Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Solana CLI (for smart contracts)
- Phantom or Solflare wallet

### Installation

1. **Clone the repository**
   `ash
   git clone <repository-url>
   cd goldium-defi
   `

2. **Install dependencies**
   `ash
   npm install
   `

3. **Set up environment variables**
   `ash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   `

4. **Run the development server**
   `ash
   npm run dev
   `

5. **Open your browser**
   Navigate to http://localhost:3000

### Smart Contract Deployment

1. **Navigate to contracts directory**
   `ash
   cd contracts/staking/anchor
   `

2. **Install Anchor dependencies**
   `ash
   npm install
   `

3. **Build the contract**
   `ash
   anchor build
   `

4. **Deploy to Mainnet**
   `ash
   anchor deploy --provider.cluster mainnet
   `

##  Configuration

### Environment Variables

`env
# Solana Network Configuration
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com

# Goldium Token Configuration
NEXT_PUBLIC_GOLD_TOKEN_MINT=your_gold_token_mint_address

# Jupiter API Configuration
NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag/v6

# Staking Contract Configuration
NEXT_PUBLIC_STAKING_PROGRAM_ID=your_staking_program_id

# Metaplex Configuration
NEXT_PUBLIC_METAPLEX_RPC_URL=https://api.mainnet-beta.solana.com
`

##  Usage

### Wallet Connection
1. Click "Connect Wallet" button
2. Select Phantom or Solflare
3. Approve connection
4. View your SOL and GOLD balances

### Sending Tokens
1. Navigate to Send page
2. Select token type (SOL or GOLD)
3. Enter recipient address
4. Enter amount
5. Click "Send" and confirm transaction
6. View transaction on Solscan

### Swapping Tokens
1. Navigate to Swap page
2. Select from/to tokens
3. Enter amount
4. Set slippage tolerance
5. Click "Swap" and confirm transaction
6. View transaction on Solscan

### Staking
1. Navigate to Stake page
2. Enter amount to stake
3. Click "Stake GOLD"
4. Wait for confirmation
5. View your staking rewards
6. View transaction on Solscan

### Educational Game
1. Navigate to Game page
2. Click "Start Game"
3. Answer questions within time limit
4. Earn rewards for high scores
5. Claim NFT rewards

### Learning
1. Navigate to Learn page
2. Select a lesson
3. Read the content
4. Mark as complete
5. Track your progress

##  Security Features

- **Wallet Integration**: Secure wallet connection with proper error handling
- **Transaction Validation**: All transactions are validated before execution
- **Smart Contract Security**: Audited staking contract with proper access controls
- **Input Validation**: All user inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling and user feedback
- **Mainnet Security**: All operations on Solana Mainnet with public verification

##  UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Beautiful dark theme with gold accents
- **Glass Morphism**: Modern glass effect design elements
- **Smooth Animations**: Framer Motion animations throughout
- **Cursor Interactions**: Interactive hover effects and transitions
- **Loading States**: Proper loading indicators for all operations
- **Toast Notifications**: Real-time feedback for user actions
- **Solscan Integration**: Direct links to transaction details

##  Performance

- **Fast Loading**: Optimized bundle size and lazy loading
- **Real-time Updates**: Live balance and price updates
- **Efficient State Management**: Zustand for optimal performance
- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Automatic code splitting for better performance
- **Mainnet Performance**: Optimized for Solana Mainnet operations

##  Testing

### Frontend Testing
`ash
npm run test
`

### Smart Contract Testing
`ash
cd contracts/staking/anchor
anchor test
`

##  Deployment

### Frontend Deployment
1. Build the application
   `ash
   npm run build
   `

2. Deploy to Vercel
   `ash
   vercel --prod
   `

### Smart Contract Deployment
1. Deploy to Mainnet
   `ash
   anchor deploy --provider.cluster mainnet
   `

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

MIT License - see LICENSE file for details

##  Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

##  Future Enhancements

- [ ] Multi-token support
- [ ] Advanced trading features
- [ ] Governance token integration
- [ ] Cross-chain bridge
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Social features
- [ ] NFT marketplace integration

##  Mainnet Features

- **Real Transactions**: All operations on Solana Mainnet
- **Solscan Tracking**: Every transaction tracked on Solscan
- **Public Verification**: All transactions publicly verifiable
- **Real Balances**: Live balance fetching from Mainnet
- **Production Ready**: Fully tested and production-ready
- **High Performance**: Optimized for Mainnet operations

---

**Built with  for the Solana Mainnet ecosystem**
