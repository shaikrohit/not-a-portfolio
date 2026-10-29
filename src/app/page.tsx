'use client';

/**
 * ============================================================================
 * SHAIK ROHIT - PROFESSIONAL PORTFOLIO
 * ============================================================================
 *
 * Modular, Accessible, and High-Performance Portfolio Orchestrator.
 * Designed with a focus on Full Stack Development, React, Docker, and AI.
 */

import React from 'react';
import dynamic from 'next/dynamic';

// Layout Components
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { CursorGlow } from '@/components/layout/CursorGlow';
import { MorphingBackground } from '@/components/layout/MorphingBackground';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SectionDivider } from '@/components/ui/SectionDivider';

// Hero is rendered eagerly for optimal LCP
import { HeroSection } from '@/components/sections/HeroSection';
import {
  PathSelectionSkeleton,
  AboutSkeleton,
  ExperienceSkeleton,
  EducationSkeleton,
  AchievementsSkeleton,
  ProjectsSkeleton,
  SkillsSkeleton,
  TriviaSkeleton,
  ContactSkeleton,
} from '@/components/ui/SectionSkeletons';

// Dynamically import sections below the fold with tailored loading skeletons
const PathSelectionSection = dynamic(
  () =>
    import('@/components/sections/PathSelectionSection').then((mod) => mod.PathSelectionSection),
  {
    loading: () => <PathSelectionSkeleton />,
  }
);
const AboutSection = dynamic(
  () => import('@/components/sections/AboutSection').then((mod) => mod.AboutSection),
  { loading: () => <AboutSkeleton /> }
);
const ExperienceSection = dynamic(
  () => import('@/components/sections/ExperienceSection').then((mod) => mod.ExperienceSection),
  { loading: () => <ExperienceSkeleton /> }
);
const EducationSection = dynamic(
  () => import('@/components/sections/EducationSection').then((mod) => mod.EducationSection),
  { loading: () => <EducationSkeleton /> }
);
const AchievementsSection = dynamic(
  () => import('@/components/sections/AchievementsSection').then((mod) => mod.AchievementsSection),
  { loading: () => <AchievementsSkeleton /> }
);
const ProjectsSection = dynamic(
  () => import('@/components/sections/ProjectsSection').then((mod) => mod.ProjectsSection),
  { loading: () => <ProjectsSkeleton /> }
);
const SkillsSection = dynamic(
  () => import('@/components/sections/SkillsSection').then((mod) => mod.SkillsSection),
  { loading: () => <SkillsSkeleton /> }
);
const TriviaGame = dynamic(
  () => import('@/components/sections/TriviaGame').then((mod) => mod.TriviaGame),
  { ssr: false, loading: () => <TriviaSkeleton /> }
);
const ContactSection = dynamic(
  () => import('@/components/sections/ContactSection').then((mod) => mod.ContactSection),
  { loading: () => <ContactSkeleton /> }
);

export default function HomePage() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] antialiased transition-colors duration-300 selection:bg-blue-600 selection:text-white">
        {/* Background & Ambient Visual Effects */}
        <MorphingBackground />
        <CursorGlow />
        <ScrollProgress />

        {/* Global Floating Navigation */}
        <Navigation />

        {/* Phase 2: Hero Section Revolution */}
        <HeroSection />

        {/* Seamless Wave Transition: Hero -> PathSelection */}
        <SectionDivider
          variant="wave"
          fromColor="transparent"
          toColor="var(--surface-elevated)"
          className="opacity-40"
          height="h-12 md:h-16 lg:h-20"
        />

        {/* Tailored Journeys */}
        <PathSelectionSection />

        {/* Seamless Inverted Wave Transition: PathSelection -> About */}
        <SectionDivider
          variant="wave"
          inverted
          fromColor="transparent"
          toColor="var(--surface-elevated)"
          className="opacity-40"
          height="h-12 md:h-16 lg:h-20"
        />

        {/* Phase 3: About Me Bento Grid */}
        <AboutSection />

        {/* Luminous Chapter Beam: About -> Experience */}
        <SectionDivider variant="glow" glowColor="rgba(59, 130, 246, 0.35)" height="h-8 md:h-12" />

        {/* Phase 6: Experience & Career Track */}
        <ExperienceSection />

        {/* Phase 6: Education & Coursework */}
        <EducationSection />

        {/* Phase 6: Honors & Achievements */}
        <AchievementsSection />

        {/* Architectural Diagonal Slice: Achievements -> Projects */}
        <SectionDivider
          variant="angle"
          fromColor="transparent"
          toColor="var(--surface-elevated)"
          className="opacity-25"
          glow
          glowColor="rgba(59, 130, 246, 0.25)"
          height="h-10 md:h-14 lg:h-16"
        />

        {/* Phase 5: Projects Showcase with 3D Tilt */}
        <ProjectsSection />

        {/* Phase 4: Skills & Technical Expertise */}
        <SkillsSection />

        {/* Gamified Purple Arc Transition: Skills -> Trivia */}
        <SectionDivider
          variant="curve"
          fromColor="transparent"
          toColor="var(--surface-elevated)"
          glow
          glowColor="rgba(168, 85, 247, 0.4)"
          strokeColor="rgba(168, 85, 247, 0.35)"
          className="opacity-50"
          height="h-12 md:h-16 lg:h-20"
        />

        {/* Interactive Engagement */}
        <TriviaGame />

        {/* Luminous Light Beam: Trivia -> Contact */}
        <SectionDivider variant="glow" glowColor="rgba(59, 130, 246, 0.4)" height="h-8 md:h-12" />

        {/* Call to Action & Contact */}
        <ContactSection />

        {/* Gradient Fade Bridge: Contact -> Footer */}
        <SectionDivider
          variant="gradient"
          fromColor="transparent"
          toColor="var(--surface-elevated)"
          height="h-16 md:h-24"
        />

        {/* Footer */}
        <Footer />
      </main>
    </SmoothScroll>
  );
}
