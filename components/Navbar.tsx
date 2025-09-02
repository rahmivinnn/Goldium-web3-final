import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '../lib/wallet-context';
import { useWalletStore } from '../lib/store';
import { getWalletBalances } from '../lib/solana';
import { motion } from 'framer-motion';
import { Coins, Zap, BookOpen, Gamepad2, Activity, Star } from 'lucide-react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { setWallet, setBalances, setLoading } = useWalletStore();

  useEffect(() => {
    setWallet(publicKey, connected);
    
    if (connected && publicKey) {
      setLoading(true);
      getWalletBalances(publicKey)
        .then(({ sol, gold }) => {
          setBalances(sol, gold);
        })
        .catch((error) => {
          console.error('Error fetching balances:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [connected, publicKey, setWallet, setBalances, setLoading]);

  const navItems = [
    { name: 'Send', href: '/send', icon: Coins },
    { name: 'Swap', href: '/swap', icon: Zap },
    { name: 'Stake', href: '/stake', icon: Coins },
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'Characters', href: '/characters', icon: Star },
    { name: 'Game', href: '/game', icon: Gamepad2 },
    { name: 'Learn', href: '/learn', icon: BookOpen },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center"
            >
              <Coins className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">Goldium</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-white/80 hover:text-gold-400 transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {connected && publicKey && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center space-x-2 text-sm text-white/80"
              >
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Mainnet</span>
                </div>
                <div className="text-gold-400">
                  {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </div>
              </motion.div>
            )}
            <WalletMultiButton className="!bg-gradient-to-r !from-gold-500 !to-gold-600 hover:!from-gold-600 hover:!to-gold-700 !text-white !font-semibold !px-6 !py-3 !rounded-lg !transition-all !duration-300 !transform hover:!scale-105 !shadow-lg hover:!shadow-gold-500/25" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
