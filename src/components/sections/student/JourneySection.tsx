'use client';

/**
 * ============================================================================
 * JOURNEY SECTION (Student)
 * ============================================================================
 * 
 * @description Learning journey timeline.
 *              Part of the Student path.
 * 
 * @usage
 * ```tsx
 * import { JourneySection } from '@/components/sections/student';
 * 
 * <JourneySection />
 * ```
 * ============================================================================
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Text, FadeIn, StaggerChildren, StaggerItem } from '@/components/ui';

// ============================================================================
// TYPES
// ============================================================================

interface MilestoneData {
  year: string;
  title: string;
  description: string;
  lesson: string;
}

// ============================================================================
// DATA
// ============================================================================

const journeyMilestones: MilestoneData[] = [
  {
    year: '2018',
    title: 'First Line of Code',
    description: 'Started with HTML/CSS, building simple websites.',
    lesson: 'Everyone starts somewhere. The first step is always the hardest.',
  },
  {
    year: '2019',
    title: 'JavaScript Discovery',
    description: 'Fell in love with making websites interactive.',
    lesson: 'Programming is about solving problems, not memorizing syntax.',
  },
  {
    year: '2020',
    title: 'React Revolution',
    description: 'Discovered component-based thinking and modern tooling.',
    lesson: 'Frameworks come and go, but fundamentals last forever.',
  },
  {
    year: '2021',
    title: 'First Real Job',
    description: 'Joined a startup as a junior developer.',
    lesson: 'Real projects teach you more than any tutorial.',
  },
  {
    year: '2022',
    title: 'Full-Stack Journey',
    description: 'Expanded into backend, databases, and DevOps.',
    lesson: 'Understanding the full picture makes you a better developer.',
  },
  {
    year: '2023+',
    title: 'Giving Back',
    description: 'Mentoring juniors and contributing to open source.',
    lesson: 'Teaching others is the best way to deepen your own knowledge.',
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * TimelineMilestone
 * 
 * A single milestone in the journey timeline.
 */
function TimelineMilestone({ milestone, index }: { milestone: MilestoneData; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex items-center">
      {/* Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2" />
      
      {/* Dot */}
      <motion.div
        className="absolute left-1/2 w-4 h-4 bg-accent rounded-full -translate-x-1/2 z-10"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
      />
      
      {/* Content */}
      <div className={`w-1/2 ${isLeft ? 'pr-12 text-right' : 'pl-12 ml-auto'}`}>
        <Text variant="overline" className="text-accent mb-1">
          {milestone.year}
        </Text>
        <Text variant="h4" className="mb-2">
          {milestone.title}
        </Text>
        <Text variant="body-small" muted className="mb-3">
          {milestone.description}
        </Text>
        <div className="inline-block px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
          <Text variant="body-small" className="italic">
            "{milestone.lesson}"
          </Text>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * JourneySection
 * 
 * Displays the learning journey for students.
 * Shows milestones with lessons learned at each stage.
 */
export function JourneySection() {
  return (
    <section className="section">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <Text variant="overline" className="mb-4">
            The Path
          </Text>
          <Text variant="h2" className="mb-4" balance>
            My Learning Journey
          </Text>
          <Text variant="body-large" muted className="max-w-xl mx-auto">
            How I got here and what I learned along the way.
          </Text>
        </FadeIn>

        {/* Timeline */}
        <StaggerChildren className="space-y-12">
          {journeyMilestones.map((milestone, index) => (
            <StaggerItem key={milestone.year}>
              <TimelineMilestone milestone={milestone} index={index} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export default JourneySection;
