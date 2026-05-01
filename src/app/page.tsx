'use client';

/**
 * ============================================================================
 * SHAIK ROHIT - PROFESSIONAL PORTFOLIO
 * ============================================================================
 *
 * Modular, Accessible, and High-Performance Portfolio Orchestrator.
 * Designed with a focus on Cybersecurity and Full Stack Development.
 */

import React from 'react';

import dynamic from 'next/dynamic';

// Layout Components
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { CursorGlow } from '@/components/layout/CursorGlow';
import { MorphingBackground } from '@/components/layout/MorphingBackground';
import { ScrollProgress } from '@/components/layout/ScrollProgress';

// Hero is static for LCP
import { HeroSection } from '@/components/sections/HeroSection';

// Dynamically import sections below the fold
const PathSelectionSection = dynamic(
  () =>
    import('@/components/sections/PathSelectionSection').then((mod) => mod.PathSelectionSection),
  {
    loading: () => <div className="h-96 animate-pulse bg-neutral-50/50" />,
  }
);
const AboutSection = dynamic(() =>
  import('@/components/sections/AboutSection').then((mod) => mod.AboutSection)
);
const ExperienceSection = dynamic(() =>
  import('@/components/sections/ExperienceSection').then((mod) => mod.ExperienceSection)
);
const ProjectsSection = dynamic(() =>
  import('@/components/sections/ProjectsSection').then((mod) => mod.ProjectsSection)
);
const SkillsSection = dynamic(() =>
  import('@/components/sections/SkillsSection').then((mod) => mod.SkillsSection)
);
const TriviaGame = dynamic(() =>
  import('@/components/sections/TriviaGame').then((mod) => mod.TriviaGame)
);
const ContactSection = dynamic(() =>
  import('@/components/sections/ContactSection').then((mod) => mod.ContactSection)
);

export default function HomePage() {
  return (
    <main className="min-h-screen text-neutral-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Background & Effects */}
      <MorphingBackground />
      <CursorGlow />
      <ScrollProgress />

      {/* Navigation */}
      <Navigation />

      {/* Hero Experience */}
      <HeroSection />

      {/* Tailored Journeys */}
      <PathSelectionSection />

      {/* Core Content */}
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />

      {/* Engagement */}
      <TriviaGame />

      {/* Call to Action */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
