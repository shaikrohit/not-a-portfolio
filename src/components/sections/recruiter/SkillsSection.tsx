'use client';

/**
 * ============================================================================
 * SKILLS SECTION (Recruiter)
 * ============================================================================
 *
 * @description Skills mapped to business outcomes.
 *              Part of the Recruiter path.
 *
 * @usage
 * ```tsx
 * import { SkillsSection } from '@/components/sections/recruiter';
 *
 * <SkillsSection />
 * ```
 * ============================================================================
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Text, Card, FadeIn, StaggerChildren, StaggerItem } from '@/components/ui';
import { techStack } from '@/content';
import { cn } from '@/lib/utils';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * ProficiencyBadge
 *
 * Colored badge showing skill level.
 */
function ProficiencyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    expert: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    proficient: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    familiar: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
  };

  return (
    <span
      className={cn('rounded px-2 py-0.5 text-xs font-medium', colors[level] || colors.familiar)}
    >
      {level}
    </span>
  );
}

/**
 * SkillCard
 *
 * Shows a skill with business outcome.
 */
function SkillCard({ skill }: { skill: (typeof techStack)[0] }) {
  return (
    <Card padding="md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Skill Name + Proficiency */}
          <div className="mb-2 flex items-center gap-2">
            <Text variant="h4" as="h3" className="text-lg">
              {skill.name}
            </Text>
            <ProficiencyBadge level={skill.proficiency} />
          </div>

          {/* Years of Experience */}
          <Text variant="body-small" muted className="mb-3">
            {skill.yearsUsed} years of experience
          </Text>

          {/* Business Outcome (if available) */}
          {skill.businessOutcome && (
            <div className="mt-3 flex items-start gap-2 rounded bg-neutral-50 p-3 dark:bg-neutral-900/50">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-500" />
              <Text variant="body-small">{skill.businessOutcome}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * SkillsSection
 *
 * Displays skills with business outcomes for recruiters.
 * Focuses on value delivered, not just technologies used.
 */
export function SkillsSection() {
  return (
    <section className="section">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn>
          <Text variant="overline" className="mb-4">
            Capabilities
          </Text>
          <Text variant="h2" className="mb-4" balance>
            Skills & Expertise
          </Text>
          <Text variant="body-large" className="mb-12 max-w-2xl" muted>
            Technical skills mapped to business outcomes.
          </Text>
        </FadeIn>

        {/* Skills Grid */}
        <StaggerChildren className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {techStack.map((skill) => (
            <StaggerItem key={skill.name}>
              <SkillCard skill={skill} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export default SkillsSection;
