'use client';

/**
 * ============================================================================
 * RECRUITER PATH - SKILLS STEP
 * ============================================================================
 * 
 * Skills matrix with proficiency levels, organized by category
 * with visual skill bars and endorsements.
 */

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Star,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface Skill {
  name: string;
  level: number; // 1-100
  years: number;
  endorsements: number;
  trending?: boolean;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: Skill[];
}

// ============================================================================
// DATA
// ============================================================================

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: '🎨',
    description: 'Building responsive, accessible, and performant user interfaces',
    skills: [
      { name: 'React / Next.js', level: 95, years: 4, endorsements: 28, trending: true },
      { name: 'TypeScript', level: 92, years: 3, endorsements: 24, trending: true },
      { name: 'CSS / Tailwind', level: 90, years: 5, endorsements: 18 },
      { name: 'State Management', level: 88, years: 4, endorsements: 15 },
      { name: 'Testing (Jest/RTL)', level: 85, years: 3, endorsements: 12 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: '⚙️',
    description: 'Designing and implementing scalable server-side systems',
    skills: [
      { name: 'Node.js', level: 88, years: 4, endorsements: 22 },
      { name: 'PostgreSQL', level: 85, years: 3, endorsements: 16 },
      { name: 'REST APIs', level: 90, years: 5, endorsements: 20 },
      { name: 'GraphQL', level: 75, years: 2, endorsements: 10 },
      { name: 'Redis / Caching', level: 78, years: 2, endorsements: 8 },
    ],
  },
  {
    id: 'devops',
    name: 'DevOps & Infrastructure',
    icon: '🚀',
    description: 'Deploying and maintaining reliable cloud infrastructure',
    skills: [
      { name: 'Docker', level: 82, years: 3, endorsements: 14 },
      { name: 'CI/CD Pipelines', level: 85, years: 3, endorsements: 12, trending: true },
      { name: 'AWS Services', level: 78, years: 2, endorsements: 10 },
      { name: 'Monitoring', level: 75, years: 2, endorsements: 8 },
      { name: 'Git / Version Control', level: 95, years: 5, endorsements: 25 },
    ],
  },
  {
    id: 'soft',
    name: 'Soft Skills',
    icon: '💡',
    description: 'Leading teams and communicating effectively',
    skills: [
      { name: 'Technical Leadership', level: 88, years: 3, endorsements: 18 },
      { name: 'Mentorship', level: 85, years: 3, endorsements: 15 },
      { name: 'Code Review', level: 92, years: 4, endorsements: 20 },
      { name: 'Documentation', level: 85, years: 4, endorsements: 12 },
      { name: 'Agile / Scrum', level: 80, years: 4, endorsements: 14 },
    ],
  },
];

// ============================================================================
// CATEGORY TAB
// ============================================================================

interface CategoryTabProps {
  category: SkillCategory;
  isActive: boolean;
  onClick: () => void;
}

const CategoryTab = memo(function CategoryTab({ category, isActive, onClick }: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-xl
        transition-all duration-300 text-left w-full
        ${isActive
          ? 'bg-blue-500/10 border border-blue-500/30'
          : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'
        }
      `}
    >
      <span className="text-xl">{category.icon}</span>
      <div className="flex-1 min-w-0">
        <div className={`font-medium truncate ${isActive ? 'text-white' : 'text-white/70'}`}>
          {category.name}
        </div>
        <div className="text-xs text-white/30 truncate">{category.skills.length} skills</div>
      </div>
    </button>
  );
});

// ============================================================================
// SKILL BAR
// ============================================================================

interface SkillBarProps {
  skill: Skill;
  index: number;
}

const SkillBar = memo(function SkillBar({ skill, index }: SkillBarProps) {
  const getLevelLabel = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 75) return 'Advanced';
    if (level >= 60) return 'Intermediate';
    return 'Learning';
  };

  const getLevelColor = (level: number) => {
    if (level >= 90) return 'from-blue-500 to-blue-400';
    if (level >= 75) return 'from-blue-600 to-blue-500';
    if (level >= 60) return 'from-blue-700 to-blue-600';
    return 'from-blue-800 to-blue-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{skill.name}</span>
          {skill.trending && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-green-500/10 text-green-400">
              <TrendingUp className="w-2.5 h-2.5" />
              Hot
            </span>
          )}
        </div>
        <span className="text-sm text-blue-400">{getLevelLabel(skill.level)}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ delay: index * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getLevelColor(skill.level)} rounded-full`}
        />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-white/30">
        <span>{skill.years} years experience</span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          {skill.endorsements} endorsements
        </span>
      </div>
    </motion.div>
  );
});

// ============================================================================
// SKILLS SUMMARY
// ============================================================================

const SkillsSummary = memo(function SkillsSummary() {
  const totalSkills = skillCategories.reduce((acc, cat) => acc + cat.skills.length, 0);
  const expertSkills = skillCategories.reduce((acc, cat) => 
    acc + cat.skills.filter(s => s.level >= 90).length, 0
  );
  const totalEndorsements = skillCategories.reduce((acc, cat) => 
    acc + cat.skills.reduce((a, s) => a + s.endorsements, 0), 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-3 gap-4 mb-8"
    >
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
        <div className="text-3xl font-bold text-blue-400">{totalSkills}</div>
        <div className="text-sm text-white/30">Total Skills</div>
      </div>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
        <div className="text-3xl font-bold text-blue-400">{expertSkills}</div>
        <div className="text-sm text-white/30">Expert Level</div>
      </div>
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
        <div className="text-3xl font-bold text-blue-400">{totalEndorsements}</div>
        <div className="text-sm text-white/30">Endorsements</div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecruiterSkillsProps {
  onComplete: () => void;
}

export function RecruiterSkills({ onComplete }: RecruiterSkillsProps) {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0]!);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Skills & Expertise
            </h1>
            <p className="text-white/50 max-w-2xl">
              A comprehensive overview of my technical and professional skills,
              backed by years of hands-on experience.
            </p>
          </motion.div>

          {/* Summary */}
          <SkillsSummary />

          {/* Content Grid */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Category Navigation */}
            <div className="lg:col-span-1 space-y-2">
              {skillCategories.map((category) => (
                <CategoryTab
                  key={category.id}
                  category={category}
                  isActive={activeCategory.id === category.id}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>

            {/* Skills Grid */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Category Header */}
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-blue-500/10">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{activeCategory.icon}</span>
                      <h2 className="text-xl font-semibold text-white">{activeCategory.name}</h2>
                    </div>
                    <p className="text-sm text-white/40">{activeCategory.description}</p>
                  </div>

                  {/* Skills List */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {activeCategory.skills.map((skill, index) => (
                      <SkillBar key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/30">
            <CheckCircle className="w-4 h-4 text-green-400" />
            All skills verified through professional experience
          </div>

          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <span>View Achievements</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecruiterSkills;
