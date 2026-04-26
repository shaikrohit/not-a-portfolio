'use client';

/**
 * ============================================================================
 * TECH STACK SECTION
 * ============================================================================
 *
 * @description Displays technologies with reasoning for each choice.
 *              Part of the Developer path.
 *
 * @usage
 * ```tsx
 * import { TechStackSection } from '@/components/sections/developer';
 *
 * <TechStackSection />
 * ```
 * ============================================================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Text, Card, FadeIn, Reveal } from '@/components/ui';
import { techStack } from '@/content';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type CategoryFilter = 'all' | 'language' | 'framework' | 'tool' | 'concept';

interface SkillCardProps {
  skill: {
    name: string;
    category: string;
    proficiency: 'expert' | 'proficient' | 'familiar';
    yearsUsed: number;
    reasoning: string;
  };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * CategoryFilter
 *
 * Filter buttons to show skills by category.
 */
function CategoryFilters({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryFilter[];
  selected: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm transition-all duration-200',
            selected === category
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
          )}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

/**
 * SkillCard
 *
 * Expandable card showing a skill with reasoning.
 */
function SkillCard({ skill }: SkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Proficiency badge colors
  const proficiencyColors = {
    expert: 'bg-accent/10 text-accent',
    proficient: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    familiar: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500',
  };

  return (
    <Card variant="interactive" padding="none" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Name and Proficiency */}
            <div className="mb-1 flex items-center gap-2">
              <Text variant="h4" as="h3" className="text-lg">
                {skill.name}
              </Text>
              <span
                className={cn('rounded px-2 py-0.5 text-xs', proficiencyColors[skill.proficiency])}
              >
                {skill.proficiency}
              </span>
            </div>

            {/* Years of experience */}
            <Text variant="caption" muted>
              {skill.yearsUsed} years
            </Text>
          </div>

          {/* Expand icon */}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-neutral-400">
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Expandable: Reasoning */}
        <Reveal show={isExpanded}>
          <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <Text variant="caption" className="mb-1 uppercase tracking-wider">
              Why I use it
            </Text>
            <Text variant="body-small">{skill.reasoning}</Text>
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
 * TechStackSection
 *
 * Displays the tech stack with filterable categories.
 * Each skill shows the reasoning behind the choice.
 */
export function TechStackSection() {
  const categories: CategoryFilter[] = ['all', 'language', 'framework', 'tool', 'concept'];
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  // Filter skills based on selected category
  const filteredStack =
    selectedCategory === 'all'
      ? techStack
      : techStack.filter((skill) => skill.category === selectedCategory);

  return (
    <section className="section">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn>
          <Text variant="overline" className="mb-4">
            What I Use
          </Text>
          <Text variant="h2" className="mb-4" balance>
            Technology Stack
          </Text>
          <Text variant="body-large" className="mb-8 max-w-2xl" muted>
            Not just tools—reasoning for each choice.
          </Text>
        </FadeIn>

        {/* Category Filter */}
        <FadeIn delay={0.2}>
          <CategoryFilters
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </FadeIn>

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {filteredStack.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SkillCard skill={skill} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default TechStackSection;
