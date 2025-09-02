import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { Star, Shield, Zap, Coins, TrendingUp, BookOpen, Gamepad2, Award } from 'lucide-react';

interface Character {
  id: number;
  name: string;
  role: string;
  description: string;
  abilities: string[];
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  element: string;
  stats: {
    power: number;
    speed: number;
    wisdom: number;
    luck: number;
  };
}

const Characters: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const characters: Character[] = [
    {
      id: 1,
      name: 'K1',
      role: 'Guardian of SOL',
      description: 'The protector of Solana\'s native token, K1 ensures secure and fast SOL transactions across the network.',
      abilities: ['SOL Transfer Mastery', 'Network Security', 'Fast Confirmation'],
      rarity: 'Legendary',
      element: 'Lightning',
      stats: { power: 95, speed: 90, wisdom: 85, luck: 80 }
    },
    {
      id: 2,
      name: 'K2',
      role: 'Master of Swaps',
      description: 'Expert in token exchanges, K2 navigates the complex world of DeFi swaps with precision and efficiency.',
      abilities: ['Jupiter Integration', 'Price Oracle', 'Slippage Control'],
      rarity: 'Epic',
      element: 'Flow',
      stats: { power: 80, speed: 95, wisdom: 90, luck: 85 }
    },
    {
      id: 3,
      name: 'K3',
      role: 'Staking Specialist',
      description: 'The master of yield farming and staking strategies, K3 maximizes rewards for all DeFi participants.',
      abilities: ['Yield Optimization', 'Risk Assessment', 'Reward Calculation'],
      rarity: 'Epic',
      element: 'Growth',
      stats: { power: 85, speed: 75, wisdom: 95, luck: 90 }
    },
    {
      id: 4,
      name: 'K4',
      role: 'DeFi Strategist',
      description: 'Strategic mastermind who orchestrates complex DeFi operations and multi-protocol interactions.',
      abilities: ['Protocol Analysis', 'Strategy Planning', 'Risk Management'],
      rarity: 'Rare',
      element: 'Mind',
      stats: { power: 75, speed: 80, wisdom: 95, luck: 85 }
    },
    {
      id: 5,
      name: 'K5',
      role: 'Yield Farmer',
      description: 'Agricultural expert in the DeFi space, K5 cultivates the highest yields across multiple protocols.',
      abilities: ['Yield Farming', 'LP Management', 'Harvest Optimization'],
      rarity: 'Rare',
      element: 'Earth',
      stats: { power: 70, speed: 85, wisdom: 90, luck: 95 }
    },
    {
      id: 6,
      name: 'K6',
      role: 'Liquidity Provider',
      description: 'The backbone of DeFi markets, K6 ensures deep liquidity and smooth trading experiences.',
      abilities: ['Liquidity Provision', 'Market Making', 'Price Stability'],
      rarity: 'Common',
      element: 'Water',
      stats: { power: 75, speed: 90, wisdom: 80, luck: 75 }
    },
    {
      id: 7,
      name: 'K7',
      role: 'Risk Manager',
      description: 'Guardian against DeFi risks, K7 protects users from impermanent loss and smart contract vulnerabilities.',
      abilities: ['Risk Analysis', 'Security Audit', 'Loss Prevention'],
      rarity: 'Epic',
      element: 'Shield',
      stats: { power: 90, speed: 70, wisdom: 95, luck: 80 }
    },
    {
      id: 8,
      name: 'K8',
      role: 'Protocol Guardian',
      description: 'The ultimate protector of DeFi protocols, K8 ensures the integrity and security of the entire ecosystem.',
      abilities: ['Protocol Security', 'Governance', 'Emergency Response'],
      rarity: 'Legendary',
      element: 'Divine',
      stats: { power: 100, speed: 85, wisdom: 100, luck: 90 }
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'from-yellow-400 to-orange-500';
      case 'Epic': return 'from-purple-400 to-pink-500';
      case 'Rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getElementIcon = (element: string) => {
    switch (element) {
      case 'Lightning': return <Zap className="text-yellow-400" size={16} />;
      case 'Flow': return <TrendingUp className="text-blue-400" size={16} />;
      case 'Growth': return <Coins className="text-green-400" size={16} />;
      case 'Mind': return <BookOpen className="text-purple-400" size={16} />;
      case 'Earth': return <Shield className="text-brown-400" size={16} />;
      case 'Water': return <Star className="text-cyan-400" size={16} />;
      case 'Shield': return <Shield className="text-gray-400" size={16} />;
      case 'Divine': return <Award className="text-gold-400" size={16} />;
      default: return <Star className="text-white" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Goldium Characters
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Meet the legendary guardians of the Goldium DeFi ecosystem
            </p>
          </motion.div>

          {/* Characters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {characters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedCharacter(character.id)}
              >
                <div className="glass rounded-xl p-6 border border-white/10 hover:border-gold-500/30 transition-all duration-300 h-full">
                  <div className="relative mb-4">
                    <Image
                      src={`/karakter/K${character.id}.png`}
                      alt={character.name}
                      width={120}
                      height={120}
                      className="mx-auto rounded-full border-2 border-gold-400/50"
                    />
                    <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(character.rarity)}`}>
                      {character.rarity}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1">{character.name}</h3>
                    <p className="text-gold-400 text-sm mb-3">{character.role}</p>
                    
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      {getElementIcon(character.element)}
                      <span className="text-white/70 text-sm">{character.element}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/10 rounded p-2">
                        <div className="text-white/60">Power</div>
                        <div className="text-white font-bold">{character.stats.power}</div>
                      </div>
                      <div className="bg-white/10 rounded p-2">
                        <div className="text-white/60">Speed</div>
                        <div className="text-white font-bold">{character.stats.speed}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Character Detail Modal */}
          <AnimatePresence>
            {selectedCharacter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setSelectedCharacter(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl p-8 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const character = characters.find(c => c.id === selectedCharacter);
                    if (!character) return null;

                    return (
                      <div>
                        <div className="flex items-start space-x-6 mb-6">
                          <div className="relative">
                            <Image
                              src={`/karakter/K${character.id}.png`}
                              alt={character.name}
                              width={150}
                              height={150}
                              className="rounded-full border-4 border-gold-400/50"
                            />
                            <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getRarityColor(character.rarity)}`}>
                              {character.rarity}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-2">{character.name}</h2>
                            <p className="text-gold-400 text-lg mb-3">{character.role}</p>
                            <p className="text-white/70 mb-4">{character.description}</p>
                            
                            <div className="flex items-center space-x-2 mb-4">
                              {getElementIcon(character.element)}
                              <span className="text-white/80">{character.element} Element</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          {Object.entries(character.stats).map(([stat, value]) => (
                            <div key={stat} className="bg-white/10 rounded-lg p-3 text-center">
                              <div className="text-white/60 text-sm capitalize mb-1">{stat}</div>
                              <div className="text-2xl font-bold text-white">{value}</div>
                              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                <div 
                                  className="bg-gradient-to-r from-gold-400 to-gold-600 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Abilities */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-white mb-3">Special Abilities</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {character.abilities.map((ability, index) => (
                              <motion.div
                                key={ability}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/30 rounded-lg p-3 text-center"
                              >
                                <div className="text-gold-400 font-medium text-sm">{ability}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="text-center">
                          <button
                            onClick={() => setSelectedCharacter(null)}
                            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Character Lore Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-xl p-8 border border-white/20 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">The Goldium Legend</h2>
            <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
              In the vast digital realm of Solana, eight legendary guardians emerged to protect 
              the sacred GOLD tokens and guide users through the complex world of decentralized finance. 
              Each guardian possesses unique abilities that correspond to different aspects of DeFi operations, 
              from simple token transfers to complex yield farming strategies.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Characters;