# Contributing to Goldium

Thank you for your interest in contributing to Goldium! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: 
pm install
4. Create a new branch for your feature: git checkout -b feature/amazing-feature
5. Make your changes
6. Test your changes
7. Commit your changes: git commit -m 'Add some amazing feature'
8. Push to your fork: git push origin feature/amazing-feature
9. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development
1. Clone the repository
2. Install dependencies: 
pm install
3. Copy environment variables: cp .env.local.example .env.local
4. Start the development server: 
pm run dev
5. Open [http://localhost:3000](http://localhost:3000)

### Smart Contract Development
1. Navigate to contracts directory: cd contracts/staking/anchor
2. Install dependencies: 
pm install
3. Build the contract: nchor build
4. Deploy to devnet: nchor deploy
5. Run tests: nchor test

## Code Style

We use the following tools to maintain code quality:

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Running Linters
`ash
npm run lint
npm run lint:fix
`

### Running Type Check
`ash
npx tsc --noEmit
`

## Testing

### Frontend Testing
`ash
npm test
npm run test:watch
`

### Smart Contract Testing
`ash
cd contracts/staking/anchor
anchor test
`

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Add tests for new functionality
3. Update documentation if necessary
4. Ensure all tests pass
5. Request review from maintainers

## Issue Reporting

When reporting issues, please include:

- A clear description of the issue
- Steps to reproduce the problem
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information

## Feature Requests

When requesting features, please include:

- A clear description of the feature
- Use cases and benefits
- Any potential drawbacks
- Mockups or examples if applicable

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing to Goldium, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions, please:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Join our Discord community

Thank you for contributing to Goldium! 
