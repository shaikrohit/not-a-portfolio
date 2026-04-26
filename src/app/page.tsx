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

// Layout Components
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { CursorGlow } from '@/components/layout/CursorGlow';
import { MorphingBackground } from '@/components/layout/MorphingBackground';
import { ScrollProgress } from '@/components/layout/ScrollProgress';

// Section Components
import { HeroSection } from '@/components/sections/HeroSection';
import { PathSelectionSection } from '@/components/sections/PathSelectionSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { TriviaGame } from '@/components/sections/TriviaGame';
import { ContactSection } from '@/components/sections/ContactSection';

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
