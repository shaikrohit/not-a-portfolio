'use client';

/**
 * ============================================================================
 * STUDENT PATH - JOURNEY STEP
 * ============================================================================
 * 
 * Timeline of personal learning journey with milestones,
 * struggles, and breakthroughs.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Rocket,
  AlertTriangle,
  CheckCircle,
  Star,
  ChevronDown
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Milestone {
  id: string;
  year: string;
  title: string;
  type: 'start' | 'struggle' | 'breakthrough' | 'achievement';
  summary: string;
  details: string;
  lesson: string;
}

// ============================================================================
// DATA
// ============================================================================

const milestones: Milestone[] = [
  {
    id: '1',
    year: '2018',
    title: 'The Beginning',
    type: 'start',
    summary: 'Wrote my first line of code',
    details: `I started with a simple "Hello World" in Python, following a YouTube tutorial. 
I remember thinking, "This is it? This is what programmers do?" 
I had no idea what variables were or why semicolons mattered.`,
    lesson: 'Everyone starts somewhere. Your first code will be terrible—and that\'s perfect.',
  },
  {
    id: '2',
    year: '2018',
    title: 'Tutorial Hell',
    type: 'struggle',
    summary: 'Got stuck watching tutorials without building',
    details: `For 6 months, I watched tutorial after tutorial. I could follow along perfectly, 
but the moment I tried to build something on my own, I froze. 
I knew syntax but couldn't think programmatically.`,
    lesson: 'Stop watching, start building. Learning happens when you struggle, not when you follow.',
  },
  {
    id: '3',
    year: '2019',
    title: 'First Real Project',
    type: 'breakthrough',
    summary: 'Built a todo app from scratch (finally!)',
    details: `I forced myself to build without tutorials. It took 2 weeks for a simple todo app. 
The code was horrible—global variables everywhere, no functions. 
But it WORKED, and I built it myself.`,
    lesson: 'Ugly code that works > beautiful code that doesn\'t exist.',
  },
  {
    id: '4',
    year: '2019',
    title: 'Imposter Syndrome',
    type: 'struggle',
    summary: 'Felt like I wasn\'t cut out for this',
    details: `I looked at other developers' code and felt like a fraud. 
Everyone seemed smarter, faster, better. I almost quit three times.
The doubt was overwhelming.`,
    lesson: 'Everyone feels like an imposter. The ones who succeed are the ones who keep going anyway.',
  },
  {
    id: '5',
    year: '2020',
    title: 'First Paid Project',
    type: 'achievement',
    summary: 'Someone paid me actual money to code',
    details: `A local business paid me $200 to build their website. 
It wasn't much, but it validated everything. 
Someone trusted me with their business. I was a "real" developer.`,
    lesson: 'You don\'t need permission to be a developer. If you solve problems with code, you\'re a developer.',
  },
  {
    id: '6',
    year: '2021',
    title: 'The Job Hunt',
    type: 'struggle',
    summary: '150+ applications, mostly rejections',
    details: `I applied to everything. Junior, entry-level, intern—all of it. 
Most rejections didn't even come with feedback. 
"We've decided to move forward with other candidates" became my nightmare phrase.`,
    lesson: 'Rejection isn\'t about you. Keep improving, keep applying. It\'s a numbers game.',
  },
  {
    id: '7',
    year: '2021',
    title: 'First Tech Job',
    type: 'achievement',
    summary: 'Landed my first full-time developer role',
    details: `After 150+ applications, one company took a chance on me. 
The interview was tough, but I was honest about what I knew and didn't know.
They valued my potential over my current skills.`,
    lesson: 'Show enthusiasm and willingness to learn. Companies hire potential, not just experience.',
  },
  {
    id: '8',
    year: '2023',
    title: 'Today',
    type: 'start',
    summary: 'Senior Developer, still learning every day',
    details: `Now I lead a team and mentor others. 
But honestly? I still Google basic things. I still feel confused by new technologies.
The difference is I now embrace the confusion—it means I'm growing.`,
    lesson: 'You never stop being a student. The best developers are perpetual learners.',
  },
];

const typeConfig = {
  start: { icon: Rocket, color: 'blue', label: 'Beginning' },
  struggle: { icon: AlertTriangle, color: 'yellow', label: 'Challenge' },
  breakthrough: { icon: Star, color: 'purple', label: 'Breakthrough' },
  achievement: { icon: CheckCircle, color: 'green', label: 'Achievement' },
};

// ============================================================================
// MILESTONE CARD
// ============================================================================

interface MilestoneCardProps {
  milestone: Milestone;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const MilestoneCard = memo(function MilestoneCard({
  milestone,
  isActive,
  onClick,
  index,
}: MilestoneCardProps) {
  const config = typeConfig[milestone.type];
  const Icon = config.icon;

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-xl
        transition-all duration-300 border
        ${isActive
          ? 'bg-blue-500/10 border-blue-500/30'
          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[config.color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">{milestone.year}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${colorClasses[config.color]}`}>
              {config.label}
            </span>
          </div>
          <h3 className="font-medium text-white truncate">{milestone.title}</h3>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/20 transition-transform ${isActive ? 'rotate-180' : ''}`} />
      </div>
    </motion.button>
  );
});

// ============================================================================
// MILESTONE DETAIL
// ============================================================================

interface MilestoneDetailProps {
  milestone: Milestone;
}

const MilestoneDetail = memo(function MilestoneDetail({ milestone }: MilestoneDetailProps) {
  const config = typeConfig[milestone.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm text-white/30">{milestone.year}</span>
          <span className="text-sm px-2 py-0.5 rounded bg-white/5 text-white/50">
            {config.label}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{milestone.title}</h2>
        <p className="text-blue-400">{milestone.summary}</p>
      </div>

      {/* Story */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/80 mb-3">The Story</h4>
        <p className="text-white/50 leading-relaxed whitespace-pre-line">
          {milestone.details}
        </p>
      </div>

      {/* Lesson */}
      <div className="mt-auto p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-white mb-1">Key Lesson</h4>
            <p className="text-white/60 text-sm">{milestone.lesson}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface StudentJourneyProps {
  onComplete: () => void;
}

export function StudentJourney({ onComplete }: StudentJourneyProps) {
  const [activeMilestone, setActiveMilestone] = useState(milestones[0]!);
  const [viewedMilestones, setViewedMilestones] = useState<Set<string>>(new Set([milestones[0]?.id ?? '']));

  const handleSelect = (milestone: Milestone) => {
    setActiveMilestone(milestone);
    setViewedMilestones((prev) => new Set([...prev, milestone.id]));
  };

  const allViewed = viewedMilestones.size >= Math.min(5, milestones.length);

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
              My Learning Journey
            </h1>
            <p className="text-white/50 max-w-2xl">
              The real story of how I became a developer—including the failures,
              frustrations, and breakthroughs. Click each milestone to learn more.
            </p>

            {/* Progress */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-1">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      viewedMilestones.has(m.id) ? 'bg-blue-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-white/30">
                {viewedMilestones.size}/{milestones.length} explored
              </span>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {milestones.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isActive={activeMilestone.id === milestone.id}
                  onClick={() => handleSelect(milestone)}
                  index={index}
                />
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 p-6 rounded-2xl bg-white/[0.02] border border-white/5 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <MilestoneDetail key={activeMilestone.id} milestone={activeMilestone} />
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
            {allViewed ? 'Thanks for exploring my journey!' : 'Explore at least 5 milestones to continue.'}
          </p>

          <button
            onClick={onComplete}
            disabled={!allViewed}
            className={`
              group inline-flex items-center gap-2
              px-6 py-3 rounded-lg
              font-medium text-white
              transition-all duration-300
              ${allViewed
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/30'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }
            `}
          >
            <span>See Learning Resources</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentJourney;
