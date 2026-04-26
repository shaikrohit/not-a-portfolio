'use client';

/**
 * ============================================================================
 * Q&A SECTION (Student)
 * ============================================================================
 * 
 * @description Common questions from students with answers.
 *              Part of the Student path.
 * 
 * @usage
 * ```tsx
 * import { QASection } from '@/components/sections/student';
 * 
 * <QASection />
 * ```
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Text, Card, FadeIn, StaggerChildren, StaggerItem } from '@/components/ui';

// ============================================================================
// TYPES
// ============================================================================

interface QAItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'career' | 'learning';
}

// ============================================================================
// DATA
// ============================================================================

const qaData: QAItem[] = [
  {
    id: 'start-language',
    question: 'What programming language should I learn first?',
    answer: 'I recommend starting with JavaScript or Python. Both are beginner-friendly, have huge communities, and can be used for many different types of projects. JavaScript is great if you want to build websites, while Python is excellent for data science and automation.',
    category: 'getting-started',
  },
  {
    id: 'time-to-job',
    question: 'How long does it take to get a developer job?',
    answer: 'It varies widely, but typically 6-12 months of consistent learning and building projects. The key is quality over quantity—focus on understanding concepts deeply and building a portfolio of projects that showcase your skills.',
    category: 'career',
  },
  {
    id: 'cs-degree',
    question: 'Do I need a CS degree?',
    answer: 'No, but you need to be willing to learn the fundamentals on your own. Many successful developers are self-taught or bootcamp graduates. What matters is your ability to solve problems and learn continuously.',
    category: 'career',
  },
  {
    id: 'imposter-syndrome',
    question: 'How do you deal with imposter syndrome?',
    answer: 'Everyone experiences it, even senior developers. Remember that learning is a journey—nobody knows everything. Focus on progress, not perfection. Keep a "wins" journal to remind yourself how far you\'ve come.',
    category: 'learning',
  },
  {
    id: 'stuck-learning',
    question: 'What if I get stuck while learning?',
    answer: 'Getting stuck is normal! Take a break, then try explaining the problem out loud (rubber duck debugging). Search Stack Overflow, read documentation, or ask in communities like Discord servers or Reddit. The ability to get unstuck is a crucial skill.',
    category: 'learning',
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * QACard
 * 
 * Expandable Q&A card with animation.
 */
function QACard({ item }: { item: QAItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card 
      variant="interactive" 
      padding="none"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="p-4 md:p-6">
        {/* Question */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <Text variant="h4" className="text-base md:text-lg">
              {item.question}
            </Text>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-neutral-400 flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Answer (Expandable) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Text variant="body" muted className="mt-4 pl-8">
                {item.answer}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * QASection
 * 
 * Frequently asked questions from students.
 * Interactive accordion-style Q&A.
 */
export function QASection() {
  return (
    <section className="section">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <Text variant="overline" className="mb-4">
            Got Questions?
          </Text>
          <Text variant="h2" className="mb-4" balance>
            Student Q&A
          </Text>
          <Text variant="body-large" muted className="max-w-xl mx-auto">
            Questions I get asked most often by students.
          </Text>
        </FadeIn>

        {/* Q&A List */}
        <StaggerChildren className="space-y-4">
          {qaData.map((item) => (
            <StaggerItem key={item.id}>
              <QACard item={item} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* More Questions CTA */}
        <FadeIn className="text-center mt-12">
          <Text variant="body" muted>
            Have a question that's not listed?{' '}
            <a 
              href="mailto:hello@example.com?subject=Question from a Student"
              className="text-accent hover:underline"
            >
              Send me an email
            </a>
            —I'd love to help!
          </Text>
        </FadeIn>
      </div>
    </section>
  );
}

export default QASection;
