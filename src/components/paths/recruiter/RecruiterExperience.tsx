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
import { 
  Calendar, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  Award,
  TrendingUp
} from 'lucide-react';

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
    description: 'Leading frontend architecture and development for the core product platform. Driving technical decisions and mentoring a team of 5 engineers.',
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
    description: 'Early engineer (#8) at a Series A startup. Built core product features and helped scale the platform from 1K to 100K users.',
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
    description: 'Developed interactive web experiences for Fortune 500 clients. Specialized in complex animations and performance optimization.',
    achievements: [
      'Delivered 20+ client projects with 100% on-time completion rate',
      'Optimized key client site achieving 95+ Lighthouse scores',
      'Created reusable animation library used across all agency projects',
      'Won agency\'s Innovation Award for experimental WebGL project',
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
        <div className="absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-blue-500/30 to-transparent" />
      )}

      {/* Timeline Dot */}
      <div className="absolute left-4 top-6 w-4 h-4">
        <div className={`w-4 h-4 rounded-full border-2 ${
          isCurrent ? 'border-blue-500 bg-blue-500' : 'border-white/20 bg-black-900'
        }`} />
        {isCurrent && (
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />
        )}
      </div>

      {/* Content Card */}
      <button
        onClick={onClick}
        className={`
          ml-12 w-full text-left p-5 rounded-xl
          transition-all duration-300 border
          ${isActive
            ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
          }
        `}
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
              <Calendar className="w-3.5 h-3.5" />
              {experience.period.start} – {experience.period.end}
            </div>
            <div className="flex items-center gap-1 text-xs text-white/20 mt-1">
              <MapPin className="w-3 h-3" />
              {experience.location}
            </div>
          </div>
        </div>

        {/* Expand Icon */}
        <ChevronDown className={`
          absolute right-5 bottom-5 w-4 h-4 text-white/20
          transition-transform duration-300
          ${isActive ? 'rotate-180' : ''}
        `} />
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
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center text-3xl">
          {experience.logo}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{experience.role}</h2>
          <p className="text-blue-400">{experience.company}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
            <span className="px-2 py-0.5 rounded bg-white/5">{experience.type}</span>
            <span>{experience.period.start} – {experience.period.end}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/60 mb-6 leading-relaxed">{experience.description}</p>

      {/* Impact Metric */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-2xl font-bold text-blue-400">{experience.impact.value}</div>
            <div className="text-sm text-white/40">{experience.impact.metric}</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400" />
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
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              {achievement}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Technologies */}
      <div className="mt-auto">
        <h4 className="text-sm font-medium text-white/80 mb-3">Technologies Used</h4>
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <span key={tech} className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 text-white/60 rounded-lg">
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Professional Experience
            </h1>
            <p className="text-white/50 max-w-2xl">
              {totalYears}+ years building products at startups and enterprises.
              Click each role to explore in detail.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2 space-y-4">
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
              <div className="sticky top-24 p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <ExperienceDetail key={activeExperience.id} experience={activeExperience} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-sm text-white/30">
            Explore each role to understand my career progression.
          </p>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <span>View Skills</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecruiterExperience;
