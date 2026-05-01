'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, User, Eye, Play } from 'lucide-react';
import { submitTriviaScore, getTriviaLeaderboard } from '@/app/_actions/trivia';
import { supabase } from '@/lib/supabase';

const questions = [
  {
    question: 'What is my primary focus in the world of computing?',
    options: [
      'Building generic landing pages',
      'Cybersecurity and Penetration Testing',
      'Mining Bitcoin on my laptop',
      'Fixing printers for my relatives',
    ],
    correct: 1,
    joke: 'I prefer breaking (into) things legally!',
  },
  {
    question: 'Where am I currently pursuing my Computer Engineering degree?',
    options: [
      'Dr. Y.C. James Yen Govt Polytechnic',
      'Harvard University (in my dreams)',
      'YouTube University',
      'I was born with the knowledge',
    ],
    correct: 0,
    joke: 'Dr. Y.C. James Yen Govt Polytechnic is the place!',
  },
  {
    question: 'What is my secret weapon for staying productive?',
    options: [
      'Pure determination and 96% academic focus',
      'Sleeping 12 hours a day',
      'Copy-pasting everything from StackOverflow',
      'Playing long jump during code compilation',
    ],
    correct: 0,
    joke: 'Focus is key to that 96% score!',
  },
  {
    question: 'If you see me at 2 AM, what am I probably doing?',
    options: [
      'Sleeping peacefully',
      'Securing networks or building AI with Sithafal',
      'Watching cat videos',
      "Wondering why my CSS isn't centering",
    ],
    correct: 1,
    joke: 'Night time is the best time for deep work.',
  },
];

export function TriviaGame() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result' | 'leaderboard'>(
    'intro'
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[] | null>(null);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await getTriviaLeaderboard();
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboard([]);
    }
  }, []);

  // Realtime Listener & Initial Fetch
  useEffect(() => {
    fetchLeaderboard();

    if (!supabase) return;

    // Listen for any changes to the trivia_scores table
    const channel = supabase
      .channel('trivia-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trivia_scores',
        },
        () => {
          // Whenever anything changes (approval, deletion, etc), refresh the list
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      if (supabase) supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  const handleAnswerClick = (index: number) => {
    if (isAnimating) return;

    setSelectedAnswer(index);
    setIsAnimating(true);

    const question = questions[currentQuestion];
    if (!question) return;

    const isCorrect = index === question.correct;
    if (isCorrect) {
      setScore((prev) => prev + 100);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsAnimating(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setGameState('result');
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

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setGameState('intro');
    setSubmitted(false);
    setUsername('');
  };

  return (
    <section id="trivia" className="relative overflow-hidden bg-neutral-50/50 px-6 py-32">
      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-600">
            Interrogation Mode
          </span>
          <h2 className="mb-6 text-4xl font-bold text-neutral-900 md:text-5xl">
            {gameState === 'intro'
              ? 'Think you know me?'
              : gameState === 'leaderboard'
                ? 'Hall of Fame'
                : 'Quick, think!'}
          </h2>
          <p className="text-lg text-neutral-600">
            {gameState === 'intro'
              ? "Let's see how well you can guess my developer habits."
              : 'Live updates from the leaderboard.'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5 md:p-12"
            >
              <div className="mb-10 flex justify-center">
                <div className="relative">
                  <Trophy className="h-20 w-20 text-purple-500/20" />
                  <Sparkles className="absolute -right-2 -top-2 h-8 w-8 text-yellow-400" />
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setGameState('playing')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-5 font-bold text-white transition-all hover:bg-neutral-800 hover:shadow-xl"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Start the Game
                </button>
                <button
                  onClick={() => setGameState('leaderboard')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 py-5 font-bold text-neutral-700 transition-all hover:border-purple-300 hover:bg-purple-50"
                >
                  <Eye className="h-5 w-5" />
                  View Leaderboard
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-12"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-purple-600">Score: {score}</span>
              </div>

              <h3 className="mb-8 text-2xl font-bold leading-tight text-neutral-900 md:text-3xl">
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
                      whileHover={!isAnimating ? { scale: 1.01 } : {}}
                      className={`relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                        showCorrect
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : showState && !isCorrect
                            ? 'border-red-500 bg-red-50 text-red-900'
                            : 'border-neutral-100 bg-white text-neutral-700 hover:border-purple-200 hover:bg-purple-50/30'
                      }`}
                    >
                      <span className="relative z-10 font-medium">{option}</span>
                      {showState && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {isCorrect ? questions[currentQuestion]?.joke : 'Nope!'}
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {(gameState === 'result' || gameState === 'leaderboard') && (
            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
              >
                {gameState === 'result' ? (
                  <>
                    <div className="mb-8 text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30">
                        <Trophy className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-neutral-900">Game Over!</h3>
                      <p className="mt-2 text-xl text-neutral-600">
                        You scored: <span className="font-bold text-purple-600">{score}</span>
                      </p>
                    </div>

                    {!submitted ? (
                      <form onSubmit={handleScoreSubmit} className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-neutral-700">
                            Claim your spot on the leaderboard
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Enter your name..."
                              required
                              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting || !username.trim()}
                          className="w-full rounded-xl bg-neutral-900 py-4 font-medium text-white transition-colors hover:bg-neutral-800"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Score'}
                        </button>
                      </form>
                    ) : (
                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 text-center font-medium text-blue-800">
                        <p>Score submitted for verification!</p>
                        <p className="mt-1 text-sm font-normal text-blue-600">
                          It will appear once approved.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                    <Trophy className="mb-6 h-16 w-16 text-purple-500" />
                    <h3 className="mb-4 text-2xl font-bold">Want to play?</h3>
                    <button
                      onClick={() => setGameState('playing')}
                      className="rounded-xl bg-purple-600 px-8 py-3 font-bold text-white transition-all hover:bg-purple-700"
                    >
                      Start Challenge
                    </button>
                  </div>
                )}

                <button
                  onClick={resetGame}
                  className="mt-4 w-full rounded-xl py-4 font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  {gameState === 'result' ? 'Play Again' : 'Back to Intro'}
                </button>
              </motion.div>

              {/* Leaderboard Panel - Now with Realtime */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative min-h-[500px] overflow-hidden rounded-3xl bg-neutral-900 p-8 text-white"
              >
                <div className="pointer-events-none absolute right-0 top-0 rounded-full bg-purple-500/20 p-32 blur-[100px]" />

                <h3 className="relative z-10 mb-6 flex items-center justify-between text-2xl font-bold">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                    Hall of Fame
                  </div>
                  <span className="animate-pulse rounded-full bg-purple-400/10 px-2 py-1 text-xs font-normal uppercase tracking-tighter text-purple-400">
                    Live Sync
                  </span>
                </h3>

                <div className="relative z-10 space-y-4">
                  {leaderboard === null ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-purple-400" />
                      <p className="mt-4 text-sm text-neutral-400">Syncing with database...</p>
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center">
                      <p className="text-neutral-400">No champions yet.</p>
                      <p className="mt-2 text-sm font-medium text-purple-400/80">
                        Be the first to claim a spot!
                      </p>
                    </div>
                  ) : (
                    leaderboard.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:translate-x-1 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
                              idx === 0
                                ? 'bg-yellow-400 text-neutral-900 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                                : idx === 1
                                  ? 'bg-neutral-300 text-neutral-900'
                                  : idx === 2
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-white/5 text-neutral-400'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-medium text-white">{entry.username}</span>
                        </div>
                        <span className="font-mono font-bold text-purple-300">
                          {entry.score} pts
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
