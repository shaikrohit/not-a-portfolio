'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight, User } from 'lucide-react';
import { submitTriviaScore, getTriviaLeaderboard } from '@/app/_actions/trivia';

const questions = [
  {
    question: "What is my primary focus in the world of computing?",
    options: [
      "Building generic landing pages",
      "Cybersecurity and Penetration Testing",
      "Mining Bitcoin on my laptop",
      "Fixing printers for my relatives"
    ],
    correct: 1,
    joke: "I prefer breaking (into) things legally!"
  },
  {
    question: "Where am I currently pursuing my Computer Engineering degree?",
    options: [
      "Dr. Y.C. James Yen Govt Polytechnic",
      "Harvard University (in my dreams)",
      "YouTube University",
      "I was born with the knowledge"
    ],
    correct: 0,
    joke: "Dr. Y.C. James Yen Govt Polytechnic is the place!"
  },
  {
    question: "What is my secret weapon for staying productive?",
    options: [
      "Pure determination and 96% academic focus",
      "Sleeping 12 hours a day",
      "Copy-pasting everything from StackOverflow",
      "Playing long jump during code compilation"
    ],
    correct: 0,
    joke: "Focus is key to that 96% score!"
  },
  {
    question: "If you see me at 2 AM, what am I probably doing?",
    options: [
      "Sleeping peacefully",
      "Securing networks or building AI with Sithafal",
      "Watching cat videos",
      "Wondering why my CSS isn't centering"
    ],
    correct: 1,
    joke: "Night time is the best time for deep work."
  }
];

export function TriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getTriviaLeaderboard();
      setLeaderboard(data);
    };
    fetchLeaderboard();
  }, [submitted]);

  const handleAnswerClick = (index: number) => {
    if (isAnimating) return;
    
    setSelectedAnswer(index);
    setIsAnimating(true);
    
    const question = questions[currentQuestion];
    if (!question) return;

    const isCorrect = index === question.correct;
    if (isCorrect) {
      setScore(prev => prev + 100);
    }
    
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnimating(false);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await submitTriviaScore(username, score);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="trivia" className="py-32 px-6 relative overflow-hidden bg-neutral-50/50">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium mb-4">
            Interrogation Mode
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Think you know me?
          </h2>
          <p className="text-lg text-neutral-600">
            Let's see how well you can guess my developer habits.
          </p>
        </motion.div>

        {!showResult ? (
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm ring-1 ring-black/5"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-medium text-neutral-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-purple-600">
                Score: {score}
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8 leading-tight">
              {questions[currentQuestion]?.question}
            </h3>

            <div className="grid gap-4">
              {questions[currentQuestion]?.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === questions[currentQuestion]?.correct;
                const showState = isAnimating && isSelected;
                const showCorrect = isAnimating && isCorrect;

                return (
                  <motion.button
                    key={idx}
                    disabled={isAnimating}
                    onClick={() => handleAnswerClick(idx)}
                    whileHover={!isAnimating ? { scale: 1.02 } : {}}
                    whileTap={!isAnimating ? { scale: 0.98 } : {}}
                    className={`p-6 text-left rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      showCorrect 
                        ? 'bg-green-50 border-green-500 text-green-900' 
                        : showState && !isCorrect 
                          ? 'bg-red-50 border-red-500 text-red-900'
                          : 'bg-white border-neutral-200 hover:border-purple-300 hover:bg-purple-50/50 text-neutral-700'
                    }`}
                  >
                    <span className="relative z-10 font-medium">{option}</span>
                    
                    {showState && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {isCorrect ? questions[currentQuestion]?.joke : "Nope!"}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-neutral-900">Game Over!</h3>
                <p className="text-xl text-neutral-600 mt-2">You scored: <span className="font-bold text-purple-600">{score}</span></p>
              </div>

              {!submitted ? (
                <form onSubmit={handleScoreSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Claim your spot on the leaderboard</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your name..."
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-neutral-50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !username.trim()}
                    className="w-full py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Score'}
                  </button>
                </form>
              ) : (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center text-green-800 font-medium">
                  Score submitted successfully!
                </div>
              )}
              
              <button
                onClick={() => {
                  setScore(0);
                  setCurrentQuestion(0);
                  setShowResult(false);
                  setSubmitted(false);
                  setUsername('');
                }}
                className="mt-4 w-full py-4 text-neutral-600 rounded-xl font-medium hover:bg-neutral-100 transition-colors"
              >
                Play Again
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neutral-900 rounded-3xl p-8 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
              
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Hall of Fame
              </h3>
              
              <div className="space-y-4 relative z-10">
                {leaderboard.length === 0 ? (
                  <p className="text-neutral-400">Loading top scores...</p>
                ) : (
                  leaderboard.map((entry, idx) => (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-neutral-300' : idx === 2 ? 'text-amber-600' : 'text-neutral-500'}`}>
                          #{idx + 1}
                        </span>
                        <span className="font-medium text-white">{entry.username}</span>
                      </div>
                      <span className="font-mono text-purple-300">{entry.score} pts</span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
