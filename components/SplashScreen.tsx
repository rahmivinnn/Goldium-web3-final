import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false);

  const characters = [
    { id: 1, name: 'K1', role: 'Guardian of SOL' },
    { id: 2, name: 'K2', role: 'Master of Swaps' },
    { id: 3, name: 'K3', role: 'Staking Specialist' },
    { id: 4, name: 'K4', role: 'DeFi Strategist' },
    { id: 5, name: 'K5', role: 'Yield Farmer' },
    { id: 6, name: 'K6', role: 'Liquidity Provider' },
    { id: 7, name: 'K7', role: 'Risk Manager' },
    { id: 8, name: 'K8', role: 'Protocol Guardian' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCharacter((prev) => {
        if (prev >= 8) {
          clearInterval(timer);
          setShowText(true);
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(onComplete, 1000);
          }, 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (!isLoading && !showText) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center"
      >
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -100],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-4">
              GOLDIUM
            </h1>
            <p className="text-xl text-white/80">DeFi on Solana Mainnet</p>
          </motion.div>

          {/* Character Showcase */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <AnimatePresence mode="wait">
              {characters.slice(0, currentCharacter).map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ 
                    scale: 0, 
                    rotate: -180, 
                    opacity: 0,
                    x: Math.cos((index * Math.PI * 2) / 8) * 100,
                    y: Math.sin((index * Math.PI * 2) / 8) * 100,
                  }}
                  animate={{ 
                    scale: index === currentCharacter - 1 ? 1.2 : 0.8, 
                    rotate: 0, 
                    opacity: 1,
                    x: Math.cos((index * Math.PI * 2) / 8) * (index === currentCharacter - 1 ? 0 : 120),
                    y: Math.sin((index * Math.PI * 2) / 8) * (index === currentCharacter - 1 ? 0 : 120),
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeOut",
                    delay: index * 0.1 
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative">
                    <Image
                      src={`/karakter/K${character.id}.png`}
                      alt={character.name}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-gold-400/50 shadow-lg"
                    />
                    {index === currentCharacter - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
                      >
                        <p className="text-gold-400 font-semibold text-sm">{character.name}</p>
                        <p className="text-white/60 text-xs">{character.role}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Loading Text */}
          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to the Future of DeFi
                </h2>
                <div className="flex items-center justify-center space-x-4 text-white/80">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-gold-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <span>Loading Solana Mainnet...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showText ? 1 : 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 grid grid-cols-2 gap-4 text-sm text-white/60"
          >
            <div>✨ Real Mainnet Transactions</div>
            <div>🔄 Jupiter Swap Integration</div>
            <div>🏦 Smart Contract Staking</div>
            <div>📊 Solscan Tracking</div>
          </motion.div>
        </div>

        {/* Goldium Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-sm"
        >
          Powered by Solana • Built with ❤️
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;