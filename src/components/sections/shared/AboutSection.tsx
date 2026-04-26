'use client';

/**
 * ============================================================================
 * ABOUT SECTION (Shared)
 * ============================================================================
 *
 * @description General about section shown across all paths.
 *              Shared between Developer, Recruiter, Student, and Explorer.
 *
 * @usage
 * ```tsx
 * import { AboutSection } from '@/components/sections/shared';
 *
 * <AboutSection />
 * ```
 * ============================================================================
 */

import React from 'react';
import { Text, Card, FadeIn, StaggerChildren, StaggerItem } from '@/components/ui';
import { profile } from '@/content';

// ============================================================================
// DATA
// ============================================================================

const personalFacts = [
  { emoji: '🎮', label: 'Gamer', description: 'RPGs and strategy games' },
  { emoji: '📚', label: 'Reader', description: 'Sci-fi and tech books' },
  { emoji: '☕', label: 'Coffee', description: '3+ cups daily' },
  { emoji: '🏃', label: 'Runner', description: 'Morning runs' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * FactCard
 *
 * A fun fact about the person.
 */
function FactCard({ fact }: { fact: (typeof personalFacts)[0] }) {
  return (
    <Card padding="md" className="text-center">
      <Text className="mb-2 text-3xl">{fact.emoji}</Text>
      <Text variant="h4" className="mb-1 text-base">
        {fact.label}
      </Text>
      <Text variant="body-small" muted>
        {fact.description}
      </Text>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AboutSection
 *
 * Personal introduction and fun facts.
 * Shown on all visitor paths.
 */
export function AboutSection() {
  return (
    <section className="section">
      <div className="container-narrow">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left: Content */}
          <FadeIn>
            <Text variant="overline" className="mb-4">
              About Me
            </Text>
            <Text variant="h2" className="mb-6" balance>
              Beyond the Code
            </Text>
            <Text variant="body-large" muted className="mb-6">
              {profile.introduction.explorer}
            </Text>
            <Text variant="body" muted>
              When I'm not coding, you'll find me exploring new technologies, contributing to open
              source, or mentoring aspiring developers. I believe that the best software comes from
              teams that value both technical excellence and human connection.
            </Text>
          </FadeIn>

          {/* Right: Fun Facts */}
          <StaggerChildren className="grid grid-cols-2 gap-4">
            {personalFacts.map((fact) => (
              <StaggerItem key={fact.label}>
                <FactCard fact={fact} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
