'use client';

/**
 * ============================================================================
 * LEARNINGS SECTION (Student)
 * ============================================================================
 * 
 * @description Key resources and learning recommendations.
 *              Part of the Student path.
 * 
 * @usage
 * ```tsx
 * import { LearningsSection } from '@/components/sections/student';
 * 
 * <LearningsSection />
 * ```
 * ============================================================================
 */

import React from 'react';
import { ExternalLink, Book, Video, Globe, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Text, Card, FadeIn, StaggerChildren, StaggerItem } from '@/components/ui';

// ============================================================================
// TYPES
// ============================================================================

interface Resource {
  name: string;
  url: string;
  description: string;
  type: 'course' | 'video' | 'website' | 'book';
}

interface CategoryData {
  category: string;
  icon: LucideIcon;
  items: Resource[];
}

// ============================================================================
// DATA
// ============================================================================

const resourceCategories: CategoryData[] = [
  {
    category: 'Free Courses',
    icon: Globe,
    items: [
      {
        name: 'freeCodeCamp',
        url: 'https://freecodecamp.org',
        description: 'Comprehensive free coding curriculum.',
        type: 'course',
      },
      {
        name: 'The Odin Project',
        url: 'https://theodinproject.com',
        description: 'Full-stack curriculum with real projects.',
        type: 'course',
      },
    ],
  },
  {
    category: 'YouTube Channels',
    icon: Video,
    items: [
      {
        name: 'Fireship',
        url: 'https://youtube.com/@fireship',
        description: 'Quick, entertaining web dev content.',
        type: 'video',
      },
      {
        name: 'Theo',
        url: 'https://youtube.com/@t3dotgg',
        description: 'Modern web development insights.',
        type: 'video',
      },
    ],
  },
  {
    category: 'Essential Books',
    icon: Book,
    items: [
      {
        name: 'Eloquent JavaScript',
        url: 'https://eloquentjavascript.net',
        description: 'Free online book for JS fundamentals.',
        type: 'book',
      },
      {
        name: 'You Don\'t Know JS',
        url: 'https://github.com/getify/You-Dont-Know-JS',
        description: 'Deep dive into JavaScript mechanics.',
        type: 'book',
      },
    ],
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * ResourceCard
 * 
 * Shows a single learning resource.
 */
function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card variant="interactive" padding="md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Text variant="h4" as="h3" className="mb-1 group-hover:text-accent transition-colors">
              {resource.name}
            </Text>
            <Text variant="body-small" muted>
              {resource.description}
            </Text>
          </div>
          <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-accent transition-colors flex-shrink-0" />
        </div>
      </Card>
    </a>
  );
}

/**
 * ResourceCategory
 * 
 * A category of learning resources.
 */
function ResourceCategory({ category }: { category: CategoryData }) {
  const Icon = category.icon;

  return (
    <div>
      {/* Category Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-accent" />
        <Text variant="h3" className="text-lg">
          {category.category}
        </Text>
      </div>
      
      {/* Resources */}
      <div className="space-y-3">
        {category.items.map((resource) => (
          <ResourceCard key={resource.name} resource={resource} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * LearningsSection
 * 
 * Curated learning resources for students.
 * Organized by category with direct links.
 */
export function LearningsSection() {
  return (
    <section className="section bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <Text variant="overline" className="mb-4">
            Recommendations
          </Text>
          <Text variant="h2" className="mb-4" balance>
            Learning Resources
          </Text>
          <Text variant="body-large" muted className="max-w-xl mx-auto">
            The resources I wish I knew about when I started.
          </Text>
        </FadeIn>

        {/* Categories Grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resourceCategories.map((category) => (
            <StaggerItem key={category.category}>
              <ResourceCategory category={category} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Pro Tips */}
        <FadeIn className="mt-12">
          <Card padding="lg" className="bg-accent/5 border-accent/20">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <Text variant="h4" className="mb-2">
                  Pro Tip: Learn by Building
                </Text>
                <Text variant="body" muted>
                  Don't just watch tutorials—build projects. Start with something 
                  simple and gradually add features. That's how real learning happens.
                </Text>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}

export default LearningsSection;
