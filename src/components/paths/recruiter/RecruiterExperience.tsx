'use client';

/**
 * ============================================================================
 * RECRUITER PATH - EXPERIENCE STEP
 * ============================================================================
 *
 * Professional experience timeline with detailed role descriptions,
 * achievements, and company information.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ChevronDown, Award, TrendingUp } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Experience {
  id: string;
  company: string;
  logo: string;
  role: string;
  type: 'Full-time' | 'Contract' | 'Freelance';
  location: string;
  period: {
    start: string;
    end: string;
  };
  description: string;
  achievements: string[];
  technologies: string[];
  impact: {
    metric: string;
    value: string;
  };
}

// ============================================================================
// DATA
// ============================================================================

const experiences: Experience[] = [
  {
    id: 'current',
    company: 'TechCorp Inc.',
    logo: '🏢',
    role: 'Senior Full-Stack Engineer',
    type: 'Full-time',
    location: 'Remote',
    period: { start: 'Jan 2022', end: 'Present' },
    description:
      'Leading frontend architecture and development for the core product platform. Driving technical decisions and mentoring a team of 5 engineers.',
    achievements: [
      'Architected new React component library reducing development time by 40%',
      'Led migration from legacy jQuery to React, improving performance by 65%',
      'Implemented CI/CD pipeline reducing deployment time from hours to minutes',
      'Established code review standards adopted by the entire engineering org',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    impact: { metric: 'Performance Improvement', value: '65%' },
  },
  {
    id: 'previous1',
    company: 'StartupXYZ',
    logo: '🚀',
    role: 'Full-Stack Developer',
    type: 'Full-time',
    location: 'San Francisco, CA',
    period: { start: 'Mar 2020', end: 'Dec 2021' },
    description:
      'Early engineer (#8) at a Series A startup. Built core product features and helped scale the platform from 1K to 100K users.',
    achievements: [
      'Built real-time collaboration features using WebSockets',
      'Designed and implemented payment integration processing $1M+ monthly',
      'Created internal tools that automated 80% of customer support tasks',
      'Recruited and onboarded 3 engineers as the team grew',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
    impact: { metric: 'User Growth', value: '100x' },
  },
  {
    id: 'previous2',
    company: 'Digital Agency Co.',
    logo: '🎨',
    role: 'Frontend Developer',
    type: 'Full-time',
    location: 'New York, NY',
    period: { start: 'Jun 2018', end: 'Feb 2020' },
    description:
      'Developed interactive web experiences for Fortune 500 clients. Specialized in complex animations and performance optimization.',
    achievements: [
      'Delivered 20+ client projects with 100% on-time completion rate',
      'Optimized key client site achieving 95+ Lighthouse scores',
      'Created reusable animation library used across all agency projects',
      "Won agency's Innovation Award for experimental WebGL project",
    ],
    technologies: ['Vue.js', 'GSAP', 'Three.js', 'Sass', 'Webpack'],
    impact: { metric: 'Projects Delivered', value: '20+' },
  },
];

// ============================================================================
// TIMELINE ITEM
// ============================================================================

interface TimelineItemProps {
  experience: Experience;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
  index: number;
}

const TimelineItem = memo(function TimelineItem({
  experience,
  isActive,
  isLast,
  onClick,
  index,
}: TimelineItemProps) {
  const isCurrent = experience.period.end === 'Present';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="relative"
    >
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute bottom-0 left-6 top-14 w-px bg-gradient-to-b from-blue-500/30 to-transparent" />
      )}

      {/* Timeline Dot */}
      <div className="absolute left-4 top-6 h-4 w-4">
        <div
          className={`h-4 w-4 rounded-full border-2 ${
            isCurrent ? 'border-blue-500 bg-blue-500' : 'bg-black-900 border-white/20'
          }`}
        />
        {isCurrent && (
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-30" />
        )}
      </div>

      {/* Content Card */}
      <button
        onClick={onClick}
        className={`ml-12 w-full rounded-xl border p-5 text-left transition-all duration-300 ${
          isActive
            ? 'border-blue-500/30 bg-blue-500/10 shadow-lg shadow-blue-500/10'
            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
        } `}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{experience.logo}</div>
            <div>
              <h3 className="font-semibold text-white">{experience.role}</h3>
              <p className="text-sm text-white/50">{experience.company}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-white/30">
              <Calendar className="h-3.5 w-3.5" />
              {experience.period.start} – {experience.period.end}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-white/20">
              <MapPin className="h-3 w-3" />
              {experience.location}
            </div>
          </div>
        </div>

        {/* Expand Icon */}
        <ChevronDown
          className={`absolute bottom-5 right-5 h-4 w-4 text-white/20 transition-transform duration-300 ${isActive ? 'rotate-180' : ''} `}
        />
      </button>
    </motion.div>
  );
});

// ============================================================================
// EXPERIENCE DETAIL
// ============================================================================

interface ExperienceDetailProps {
  experience: Experience;
}

const ExperienceDetail = memo(function ExperienceDetail({ experience }: ExperienceDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col"
    >
      {/* Header */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-3xl">
          {experience.logo}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{experience.role}</h2>
          <p className="text-blue-400">{experience.company}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-white/40">
            <span className="rounded bg-white/5 px-2 py-0.5">{experience.type}</span>
            <span>
              {experience.period.start} – {experience.period.end}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 leading-relaxed text-white/60">{experience.description}</p>

      {/* Impact Metric */}
      <div className="mb-6 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <div>
            <div className="text-2xl font-bold text-blue-400">{experience.impact.value}</div>
            <div className="text-sm text-white/40">{experience.impact.metric}</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-white/80">
          <Award className="h-4 w-4 text-blue-400" />
          Key Achievements
        </h4>
        <ul className="space-y-2">
          {experience.achievements.map((achievement, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2 text-sm text-white/50"
            >
              <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
              {achievement}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Technologies */}
      <div className="mt-auto">
        <h4 className="mb-3 text-sm font-medium text-white/80">Technologies Used</h4>
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecruiterExperienceProps {
  onComplete: () => void;
}

export function RecruiterExperience({ onComplete }: RecruiterExperienceProps) {
  const [activeExperience, setActiveExperience] = useState(experiences[0]!);

  const totalYears = 5; // Calculate from experiences

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
              Professional Experience
            </h1>
            <p className="max-w-2xl text-white/50">
              {totalYears}+ years building products at startups and enterprises. Click each role to
              explore in detail.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Timeline */}
            <div className="space-y-4 lg:col-span-2">
              {experiences.map((exp, index) => (
                <TimelineItem
                  key={exp.id}
                  experience={exp}
                  isActive={activeExperience.id === exp.id}
                  isLast={index === experiences.length - 1}
                  onClick={() => setActiveExperience(exp)}
                  index={index}
                />
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 min-h-[500px] rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <AnimatePresence mode="wait">
                  <ExperienceDetail key={activeExperience.id} experience={activeExperience} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <p className="text-sm text-white/30">
            Explore each role to understand my career progression.
          </p>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-500 hover:to-blue-400"
          >
            <span>View Skills</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecruiterExperience;
