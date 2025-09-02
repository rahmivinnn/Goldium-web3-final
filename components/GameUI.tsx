import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Trophy, Star, Coins, BookOpen, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

interface GameState {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  answers: number[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is Solana's average block time?",
    options: ["~400ms", "~2 seconds", "~10 seconds", "~1 minute"],
    correct: 0,
    explanation: "Solana has an average block time of approximately 400 milliseconds, making it one of the fastest blockchains.",
    category: "Basics"
  },
  {
    id: 2,
    question: "What consensus mechanism does Solana use?",
    options: ["Proof of Work", "Proof of Stake", "Proof of History", "Delegated Proof of Stake"],
    correct: 2,
    explanation: "Solana uses Proof of History (PoH) combined with Proof of Stake, which allows for high throughput and low latency.",
    category: "Technology"
  },
  {
    id: 3,
    question: "What is the native token of Solana?",
    options: ["SOL", "SUN", "SALT", "SAND"],
    correct: 0,
    explanation: "SOL is the native token of the Solana blockchain, used for transaction fees and staking.",
    category: "Basics"
  },
  {
    id: 4,
    question: "What is an SPL token?",
    options: ["A special type of NFT", "A token standard on Solana", "A smart contract", "A wallet type"],
    correct: 1,
    explanation: "SPL (Solana Program Library) tokens are the standard for creating fungible tokens on Solana, similar to ERC-20 on Ethereum.",
    category: "Technology"
  },
  {
    id: 5,
    question: "What is the approximate transaction fee on Solana?",
    options: [".00025", ".01", ".1", ".00"],
    correct: 0,
    explanation: "Solana transactions typically cost around .00025, making it extremely cost-effective for users.",
    category: "Economics"
  }
];

const GameUI: React.FC = () => {
  const { publicKey } = useWallet();
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    timeLeft: 30,
    gameStarted: false,
    gameCompleted: false,
    answers: []
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState.gameStarted && !gameState.gameCompleted && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && !gameState.gameCompleted) {
      handleTimeUp();
    }

    return () => clearTimeout(timer);
  }, [gameState.timeLeft, gameState.gameStarted, gameState.gameCompleted]);

  const startGame = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      timeLeft: 30,
      gameStarted: true,
      gameCompleted: false,
      answers: []
    });
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQ = questions[gameState.currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct;
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + (isCorrect ? 1 : 0),
      answers: [...prev.answers, selectedAnswer]
    }));

    setShowExplanation(true);
    
    if (isCorrect) {
      toast.success('Correct! ');
    } else {
      toast.error('Incorrect! ');
    }
  };

  const handleNextQuestion = () => {
    if (gameState.currentQuestion < questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeLeft: 30
      }));
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeGame();
    }
  };

  const handleTimeUp = () => {
    setGameState(prev => ({
      ...prev,
      answers: [...prev.answers, -1] // -1 indicates no answer
    }));
    setShowExplanation(true);
    toast.error('Time\'s up! ');
  };

  const completeGame = () => {
    setGameState(prev => ({
      ...prev,
      gameCompleted: true,
      gameStarted: false
    }));

    const percentage = (gameState.score / questions.length) * 100;
    
    if (percentage >= 80) {
      toast.success('Excellent! You earned a reward! ');
    } else if (percentage >= 60) {
      toast.success('Good job! You passed! ');
    } else {
      toast.error('Try again to improve your score! ');
    }
  };

  const claimReward = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet to claim rewards');
      return;
    }

    try {
      // Mock reward claiming - in real implementation, this would mint an NFT or send GOLD tokens
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Reward claimed! Check your wallet! ');
    } catch (error) {
      toast.error('Failed to claim reward');
    }
  };

  const getScoreColor = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'Excellent! You\'re a Solana expert! ';
    if (percentage >= 60) return 'Good job! You know your Solana basics! ';
    return 'Keep learning! Solana has much more to offer! ';
  };

  if (!gameState.gameStarted && !gameState.gameCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-2xl mx-auto text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Gamepad2 className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Solana Knowledge Game</h2>
          <p className="text-white/70 text-lg">
            Test your knowledge about Solana blockchain and earn rewards!
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-dark rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-white/70 text-sm">Questions</span>
              </div>
              <div className="text-2xl font-bold text-white">{questions.length}</div>
            </div>
            
            <div className="glass-dark rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white/70 text-sm">Time Limit</span>
              </div>
              <div className="text-2xl font-bold text-white">30s each</div>
            </div>
            
            <div className="glass-dark rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-gold-400 mr-2" />
                <span className="text-white/70 text-sm">Reward</span>
              </div>
              <div className="text-2xl font-bold text-white">NFT</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="btn-primary text-lg px-8 py-4"
          >
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5" />
              <span>Start Game</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameState.gameCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-2xl mx-auto text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Game Complete!</h2>
          <p className={	ext-lg font-semibold }>
            {getScoreMessage(gameState.score)}
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass-dark rounded-lg p-6">
            <div className="text-4xl font-bold gradient-text mb-2">
              {gameState.score}/{questions.length}
            </div>
            <div className="text-white/70">Final Score</div>
          </div>

          {(gameState.score / questions.length) >= 0.6 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={claimReward}
              className="btn-primary text-lg px-8 py-4"
            >
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5" />
                <span>Claim Reward</span>
              </div>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="btn-secondary text-lg px-8 py-4"
          >
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-5 h-5" />
              <span>Play Again</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[gameState.currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-2xl mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white/70">
          Question {gameState.currentQuestion + 1} of {questions.length}
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-gold-400" />
          <span className="text-white font-semibold">{gameState.score}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70">Time Left</span>
          <span className={ont-bold }>
            {gameState.timeLeft}s
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: ${(gameState.timeLeft / 30) * 100}% }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="text-sm text-gold-400 font-medium mb-2">{currentQ.category}</div>
        <h3 className="text-xl font-bold text-white mb-6">{currentQ.question}</h3>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQ.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(index)}
            disabled={showExplanation}
            className={w-full p-4 rounded-lg text-left transition-all }
          >
            <div className="flex items-center space-x-3">
              <div className={w-6 h-6 rounded-full border-2 flex items-center justify-center }>
                {selectedAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
                {showExplanation && index === currentQ.correct && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
                {showExplanation && selectedAnswer === index && index !== currentQ.correct && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span>{option}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Explanation</span>
              </div>
              <p className="text-white/70 text-sm">{currentQ.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={showExplanation ? handleNextQuestion : handleSubmitAnswer}
        disabled={selectedAnswer === null && !showExplanation}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {showExplanation ? 'Next Question' : 'Submit Answer'}
      </motion.button>
    </motion.div>
  );
};

export default GameUI;
