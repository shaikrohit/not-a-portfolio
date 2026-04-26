'use client';

/**
 * ============================================================================
 * PHILOSOPHY SECTION
 * ============================================================================
 *
 * @description Displays the engineering philosophy and principles.
 *              Part of the Developer path.
 *
 * @usage
 * ```tsx
 * import { PhilosophySection } from '@/components/sections/developer';
 *
 * <PhilosophySection />
 * ```
 *
 * @dependencies
 * - Content from `@/content` (philosophy)
 * - UI components (Text, Card, Button, FadeIn)
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Text, Card, FadeIn, StaggerChildren, StaggerItem, Reveal } from '@/components/ui';
import { philosophy } from '@/content';

// ============================================================================
// TYPES
// ============================================================================

interface PrincipleCardProps {
  /** The principle data to display */
  principle: {
    id: string;
    title: string;
    description: string;
    example: string;
  };
  /** Whether this card is currently expanded */
  isExpanded: boolean;
  /** Callback when card is clicked */
  onToggle: () => void;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * PrincipleCard
 *
 * An expandable card showing a single engineering principle.
 */
function PrincipleCard({ principle, isExpanded, onToggle }: PrincipleCardProps) {
  return (
    <Card variant="interactive" padding="none" onClick={onToggle}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Text variant="h4" className="mb-2">
              {principle.title}
            </Text>
            <Text variant="body" muted>
              {principle.description}
            </Text>
          </div>

          {/* Expand/Collapse Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 text-neutral-400"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>

        {/* Expandable Content */}
        <Reveal show={isExpanded}>
          <div className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
            <Text variant="caption" className="mb-2 uppercase tracking-wider">
              Example
            </Text>
            <Text variant="body-small" className="italic">
              {principle.example}
            </Text>
          </div>
        </Reveal>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * PhilosophySection
 *
 * Displays engineering principles with expandable examples.
 * Designed for developers who want to understand your thinking.
 */
export function PhilosophySection() {
  // State: which principle is currently expanded
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);

  // Toggle a principle's expanded state
  const handleToggle = (principleId: string) => {
    setExpandedPrinciple(expandedPrinciple === principleId ? null : principleId);
  };

  return (
    <section className="section">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn>
          <Text variant="overline" className="mb-4">
            How I Think
          </Text>
          <Text variant="h2" className="mb-4" balance>
            {philosophy.title}
          </Text>
          <Text variant="body-large" className="mb-12 max-w-2xl" muted>
            {philosophy.subtitle}
          </Text>
        </FadeIn>

        {/* Principles List */}
        <StaggerChildren className="space-y-4">
          {philosophy.principles.map((principle) => (
            <StaggerItem key={principle.id}>
              <PrincipleCard
                principle={principle}
                isExpanded={expandedPrinciple === principle.id}
                onToggle={() => handleToggle(principle.id)}
              />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export default PhilosophySection;
