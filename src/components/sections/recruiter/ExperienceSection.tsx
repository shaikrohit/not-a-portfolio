'use client';

/**
 * ============================================================================
 * EXPERIENCE SECTION (Recruiter)
 * ============================================================================
 * 
 * @description Work experience with achievements.
 *              Part of the Recruiter path.
 * 
 * @usage
 * ```tsx
 * import { ExperienceSection } from '@/components/sections/recruiter';
 * 
 * <ExperienceSection />
 * ```
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, ChevronDown } from 'lucide-react';
import { Text, Card, FadeIn, StaggerChildren, StaggerItem, Reveal } from '@/components/ui';
import { experience } from '@/content';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * ExperienceCard
 * 
 * Shows a single job with expandable achievements.
 */
function ExperienceCard({ job }: { job: typeof experience[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      variant="interactive" 
      padding="none" 
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Role */}
            <Text variant="h4" className="mb-1">
              {job.role}
            </Text>
            
            {/* Company + Duration */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {job.period}
              </span>
            </div>
          </div>
          
          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-neutral-400 flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Description */}
        <Text variant="body-small" muted className="mt-3">
          {job.description}
        </Text>

        {/* Expandable: Achievements */}
        <Reveal show={isExpanded}>
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Text variant="caption" className="uppercase tracking-wider mb-3">
              Key Achievements
            </Text>
            <ul className="space-y-2">
              {job.achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <Text variant="body-small">{achievement}</Text>
                </li>
              ))}
            </ul>
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
 * ExperienceSection
 * 
 * Displays work experience with quantified achievements.
 * Designed for recruiters to quickly assess experience.
 */
export function ExperienceSection() {
  return (
    <section className="section">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn>
          <Text variant="overline" className="mb-4">
            Track Record
          </Text>
          <Text variant="h2" className="mb-4" balance>
            Work Experience
          </Text>
          <Text variant="body-large" className="mb-12 max-w-2xl" muted>
            Positions held with quantified achievements.
          </Text>
        </FadeIn>

        {/* Experience List */}
        <StaggerChildren className="space-y-4">
          {experience.map((job) => (
            <StaggerItem key={job.id}>
              <ExperienceCard job={job} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export default ExperienceSection;
