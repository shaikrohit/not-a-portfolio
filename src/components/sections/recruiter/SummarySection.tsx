'use client';

/**
 * ============================================================================
 * SUMMARY SECTION (Recruiter)
 * ============================================================================
 * 
 * @description Professional summary with quick access to resume.
 *              Part of the Recruiter path.
 * 
 * @usage
 * ```tsx
 * import { SummarySection } from '@/components/sections/recruiter';
 * 
 * <SummarySection />
 * ```
 * ============================================================================
 */

import React from 'react';
import { Download, Mail, Linkedin, MapPin } from 'lucide-react';
import { Text, Card, FadeIn } from '@/components/ui';
import { profile } from '@/content';

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * GlanceItem
 * 
 * A single stat in the "At a Glance" section.
 */
function GlanceItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text variant="caption" muted className="uppercase tracking-wider">
        {label}
      </Text>
      <Text variant="body" className="font-medium">
        {value}
      </Text>
    </div>
  );
}

/**
 * QuickActions
 * 
 * Download resume, email, LinkedIn buttons.
 */
function QuickActions() {
  return (
    <div className="space-y-3">
      <a
        href={profile.resumeUrl}
        download
        className="flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Resume
      </a>
      <a
        href={`mailto:${profile.email}`}
        className="flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Mail className="w-4 h-4" />
        Get in Touch
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-5 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
      >
        <Linkedin className="w-4 h-4" />
        LinkedIn Profile
      </a>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * SummarySection
 * 
 * Professional summary optimized for recruiters.
 * Shows key info at a glance with easy resume download.
 */
export function SummarySection() {
  return (
    <section className="section">
      <div className="container-narrow">
        <FadeIn>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left Column: Profile Info + Actions */}
            <div className="md:w-1/3">
              <div className="sticky top-24">
                <Text variant="overline" className="mb-4">
                  Professional Summary
                </Text>
                <Text variant="h2" className="mb-2">
                  {profile.name}
                </Text>
                <Text variant="body-large" muted className="mb-4">
                  {profile.title}
                </Text>
                
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>

                <QuickActions />
              </div>
            </div>

            {/* Right Column: Summary Content */}
            <div className="md:w-2/3">
              <Card padding="lg">
                <Text variant="body-large" className="whitespace-pre-line mb-6">
                  {profile.introduction.recruiter}
                </Text>
                
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                  <Text variant="h4" className="mb-4">
                    At a Glance
                  </Text>
                  <div className="grid grid-cols-2 gap-4">
                    <GlanceItem label="Experience" value="5+ years" />
                    <GlanceItem label="Specialization" value="Full-stack Web" />
                    <GlanceItem label="Leadership" value="Team Lead" />
                    <GlanceItem label="Availability" value="Open to offers" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default SummarySection;
