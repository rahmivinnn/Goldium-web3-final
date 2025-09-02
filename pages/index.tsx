import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import WalletConnect from '../components/WalletConnect';
import SplashScreen from '../components/SplashScreen';
import TransactionHistory from '../components/TransactionHistory';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coins, Zap, Gamepad2, BookOpen, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

const Home: React.FC = () => {
  const { connected } = useWallet();
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('goldium_visited');
    if (hasVisited) {
      setShowSplash(false);
    } else {
      localStorage.setItem('goldium_visited', 'true');
    }
  }, []);

  const features = [
    {
      icon: Coins,
      title: 'Send Tokens',
      description: 'Send SOL and GOLD tokens with real on-chain transactions on Mainnet',
      href: '/send',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Swap Tokens',
      description: 'Swap between SOL and GOLD using live Jupiter pricing on Mainnet',
      href: '/swap',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Stake GOLD',
      description: 'Stake your GOLD tokens and earn rewards on Solana Mainnet',
      href: '/stake',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Gamepad2,
      title: 'Educational Game',
      description: 'Learn Solana basics through interactive gameplay',
      href: '/game',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: BookOpen,
      title: 'Learn Solana',
      description: 'Interactive modules about Solana blockchain',
      href: '/learn',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure & Fast',
      description: 'Built on Solana Mainnet for lightning-fast transactions',
      href: '#',
      color: 'from-yellow-500 to-gold-500'
    }
  ];

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 via-purple-500/20 to-gold-500/20 animate-gradient-xy"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                <span className="gradient-text">Goldium</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
              >
                The future of DeFi on Solana Mainnet. Trade, stake, and learn with real on-chain transactions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mb-12"
              >
                {!connected ? (
                  <WalletConnect />
                ) : (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Welcome to Goldium!</h3>
                    <p className="text-white/70 mb-6">Your wallet is connected to Solana Mainnet. Explore our features below.</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold gradient-text mb-4">Features</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Everything you need for DeFi on Solana Mainnet, built with real on-chain transactions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group"
                  >
                    <Link href={feature.href}>
                      <div className="card card-hover h-full">
                        <div className={w-12 h-12 bg-gradient-to-r  rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-white/70">{feature.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-slate-800/50 to-purple-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold gradient-text mb-4">Built on Solana Mainnet</h2>
              <p className="text-xl text-white/70">
                Lightning-fast transactions with minimal fees, all tracked on Solscan
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">~400ms</div>
                <div className="text-white/70">Block Time</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">.00025</div>
                <div className="text-white/70">Average Fee</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">65,000+</div>
                <div className="text-white/70">TPS Capacity</div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Transaction History Component */}
      <TransactionHistory />
    </div>
  );
};

export default Home;
