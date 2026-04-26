'use client';

/**
 * ============================================================================
 * STUDENT PATH - Q&A STEP (FINAL)
 * ============================================================================
 * 
 * Frequently asked questions with detailed answers,
 * and connection options for further help.
 */

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  ChevronDown,
  Mail,
  Twitter,
  ArrowRight,
  Check,
  Sparkles,
  Heart
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// ============================================================================
// DATA
// ============================================================================

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'Do I need a degree to become a developer?',
    answer: `No, absolutely not. I don't have a CS degree, and neither do many successful developers I know. What matters is: Can you build things? Can you solve problems? Companies increasingly care about skills, not credentials.

That said, a degree isn't useless—it can open doors and provide structure. But it's not a requirement. Self-taught developers get hired every day.`,
  },
  {
    id: '2',
    question: 'How long does it take to become job-ready?',
    answer: `Honestly? It depends on how much time you invest. With consistent daily practice:
- 6-12 months to grasp fundamentals
- 12-18 months to be job-ready
- 2+ years to feel somewhat confident

But here's the thing: you'll never feel "ready." Apply before you feel ready. Get rejected. Learn from interviews. The job search is part of the learning process.`,
  },
  {
    id: '3',
    question: 'Which programming language should I start with?',
    answer: `For web development: JavaScript. It's everywhere—frontend, backend, mobile. Learn it well, and you can build almost anything.

But honestly, the language matters less than you think. The concepts transfer. Once you know one language well, learning others becomes much easier. Pick one and go deep.`,
  },
  {
    id: '4',
    question: 'Should I learn frontend or backend first?',
    answer: `Start with frontend. Here's why:
1. You see results immediately (motivation!)
2. It's easier to understand initially
3. More entry-level jobs available
4. You can always add backend later

That said, having basic backend knowledge helps. Understanding how the whole stack works makes you a better developer.`,
  },
  {
    id: '5',
    question: 'How do I build a portfolio without experience?',
    answer: `Build personal projects! Some ideas:
- Clone popular apps (Twitter, Trello, etc.)
- Build tools you actually need
- Contribute to open source
- Create a project for a local business (free)

Your portfolio doesn't need 50 projects. 3-4 solid projects with clean code and good documentation is enough. Quality over quantity.`,
  },
  {
    id: '6',
    question: 'Is it too late to start? (I\'m [age] years old)',
    answer: `It's never too late. I've mentored career changers in their 30s, 40s, and 50s who are now working as developers. Age is an advantage—you bring life experience, work ethic, and perspective that 22-year-olds don't have.

The tech industry needs diverse perspectives. Start today.`,
  },
  {
    id: '7',
    question: 'How do I stay motivated when learning is hard?',
    answer: `Motivation is unreliable. Build systems instead:
- Code at the same time daily (habit)
- Set small, achievable goals
- Track your progress visibly
- Join a community for accountability
- Remember: confusion means you're learning

When I wanted to quit, I'd look at my progress from 3 months ago. You'll be amazed how far you've come.`,
  },
];

// ============================================================================
// FAQ ITEM
// ============================================================================

interface FAQItemProps {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FAQItem = memo(function FAQItem({ faq, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="border-b border-white/5 last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between gap-4 text-left hover:bg-white/[0.01] transition-colors"
      >
        <span className="font-medium text-white">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-white/50 whitespace-pre-line leading-relaxed">
          {faq.answer}
        </p>
      </motion.div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface StudentQAProps {
  onComplete: () => void;
}

export function StudentQA({ onComplete }: StudentQAProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handleComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30 mb-6"
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto">
              Questions I hear from aspiring developers all the time.
              Click any question to see my honest answer.
            </p>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/[0.02] border border-white/5 px-6"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
                index={index}
              />
            ))}
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20"
          >
            <div className="text-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Have More Questions?
              </h3>
              <p className="text-white/50">
                I'm always happy to help fellow learners. Reach out!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:hello@example.com?subject=Question from a Student"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
                Send an Email
              </a>
              <a
                href="https://twitter.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
                DM on Twitter
              </a>
            </div>
          </motion.div>

          {/* Final Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Heart className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">You've got this. Believe in yourself.</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-center">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-green-400"
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Journey Complete! Good luck! 🎉</span>
            </motion.div>
          ) : (
            <button
              onClick={handleComplete}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-blue-500/30"
            >
              <span className="text-lg">Complete Student Journey</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentQA;
