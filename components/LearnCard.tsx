import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, CheckCircle, Play, Zap, Coins, Shield, Globe } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: string;
  completed: boolean;
  category: string;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "What is Solana?",
    description: "Learn the basics of Solana blockchain",
    icon: Globe,
    content: "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today. It's designed to handle thousands of transactions per second with sub-second finality and low fees.",
    completed: false,
    category: "Basics"
  },
  {
    id: 2,
    title: "Proof of History",
    description: "Understand Solana's unique consensus mechanism",
    icon: Zap,
    content: "Proof of History (PoH) is a cryptographic clock that allows Solana to create a historical record of events. This enables the network to process transactions in parallel without waiting for global consensus.",
    completed: false,
    category: "Technology"
  },
  {
    id: 3,
    title: "SPL Tokens",
    description: "Learn about Solana's token standard",
    icon: Coins,
    content: "SPL (Solana Program Library) tokens are the standard for creating fungible tokens on Solana. They're similar to ERC-20 tokens on Ethereum but with lower fees and faster transactions.",
    completed: false,
    category: "Tokens"
  },
  {
    id: 4,
    title: "Transaction Fees",
    description: "Understand Solana's fee structure",
    icon: Shield,
    content: "Solana transactions typically cost around .00025, making it one of the most cost-effective blockchains. Fees are paid in SOL and help prevent spam while keeping the network secure.",
    completed: false,
    category: "Economics"
  }
];

const LearnCard: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleCompleteLesson = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
    setSelectedLesson(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Basics': return 'from-blue-500 to-cyan-500';
      case 'Technology': return 'from-purple-500 to-pink-500';
      case 'Tokens': return 'from-gold-500 to-gold-600';
      case 'Economics': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getProgressPercentage = () => {
    return (completedLessons.length / lessons.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Learning Progress</h2>
            <p className="text-white/70">Complete lessons to master Solana</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold gradient-text">
              {completedLessons.length}/{lessons.length}
            </div>
            <div className="text-white/70 text-sm">Lessons Completed</div>
          </div>
        </div>

        <div className="w-full bg-white/10 rounded-full h-3 mb-2">
          <motion.div
            className="bg-gradient-to-r from-gold-500 to-gold-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: ${getProgressPercentage()}% }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="text-sm text-white/60">
          {getProgressPercentage().toFixed(0)}% Complete
        </div>
      </motion.div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, index) => {
          const Icon = lesson.icon;
          const isCompleted = completedLessons.includes(lesson.id);
          
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="card cursor-pointer"
              onClick={() => handleLessonSelect(lesson)}
            >
              <div className="flex items-start space-x-4">
                <div className={w-12 h-12 bg-gradient-to-r  rounded-lg flex items-center justify-center flex-shrink-0}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3">{lesson.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded">
                      {lesson.category}
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lesson Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={w-10 h-10 bg-gradient-to-r  rounded-lg flex items-center justify-center}>
                    <selectedLesson.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedLesson.title}</h2>
                    <span className="text-sm text-white/60">{selectedLesson.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  
                </button>
              </div>

              <div className="mb-6">
                <p className="text-white/80 leading-relaxed">{selectedLesson.content}</p>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCompleteLesson(selectedLesson.id)}
                  disabled={completedLessons.includes(selectedLesson.id)}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {completedLessons.includes(selectedLesson.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLesson(null)}
                  className="btn-secondary"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Message */}
      {completedLessons.length === lessons.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card mt-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Congratulations!</h3>
            <p className="text-white/70">
              You've completed all Solana lessons. You're now ready to explore the ecosystem!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LearnCard;
