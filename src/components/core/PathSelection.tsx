'use client';

/**
 * ============================================================================
 * PATH SELECTION SCREEN
 * ============================================================================
 * 
 * Premium entry point where users select their path.
 * Features animated cards, visual feedback, and no-back-navigation design.
 */

import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Briefcase, 
  GraduationCap, 
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type PathType = 'developer' | 'recruiter' | 'student' | 'explorer';

interface PathOption {
  id: PathType;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  features: string[];
}

interface PathSelectionProps {
  onSelect: (path: PathType) => void;
  isLoading?: boolean;
}

// ============================================================================
// PATH DATA
// ============================================================================

const paths: PathOption[] = [
  {
    id: 'developer',
    title: 'Developer',
    subtitle: 'Technical Deep Dive',
    description: 'Explore code architecture, engineering philosophy, and technical decisions.',
    icon: Code2,
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    features: ['Code samples', 'Architecture docs', 'Tech stack details'],
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    subtitle: 'Professional Overview',
    description: 'Quick access to experience, skills, and professional achievements.',
    icon: Briefcase,
    gradient: 'from-blue-700 via-blue-600 to-blue-400',
    features: ['Resume download', 'Work history', 'Skills matrix'],
  },
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Learning Journey',
    description: 'Resources, advice, and insights for aspiring developers.',
    icon: GraduationCap,
    gradient: 'from-blue-500 via-blue-400 to-sky-300',
    features: ['Learning resources', 'Career advice', 'Q&A section'],
  },
  {
    id: 'explorer',
    title: 'Explorer',
    subtitle: 'Free Discovery',
    description: 'Navigate freely and discover at your own pace.',
    icon: Compass,
    gradient: 'from-blue-600 via-indigo-500 to-blue-300',
    features: ['All content', 'Flexible navigation', 'Personal journey'],
  },
];

// ============================================================================
// PATH CARD COMPONENT
// ============================================================================

interface PathCardProps {
  path: PathOption;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  index: number;
}

const PathCard = memo(function PathCard({
  path,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  index,
}: PathCardProps) {
  const Icon = path.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`
        relative w-full text-left rounded-2xl p-6 md:p-8
        transition-all duration-500 ease-out
        border border-white/5
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/50 scale-[1.02]' 
          : 'bg-white/[0.02] hover:bg-white/[0.05]'
        }
        ${isHovered && !isSelected ? 'border-white/20' : ''}
        group cursor-pointer
      `}
      style={{
        boxShadow: isSelected 
          ? '0 0 60px rgba(0, 102, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)' 
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Gradient overlay on hover/select */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500
        bg-gradient-to-br ${path.gradient}
        ${isSelected ? 'opacity-10' : 'group-hover:opacity-5'}
      `} />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className={`
          inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5
          transition-all duration-500
          ${isSelected 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' 
            : 'bg-white/5 group-hover:bg-white/10'
          }
        `}>
          <Icon className={`
            w-7 h-7 transition-colors duration-300
            ${isSelected ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'}
          `} />
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className={`
            text-xl font-semibold mb-1 transition-colors duration-300
            ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}
          `}>
            {path.title}
          </h3>
          <p className={`
            text-sm font-medium transition-colors duration-300
            ${isSelected ? 'text-blue-300' : 'text-blue-400/70 group-hover:text-blue-400'}
          `}>
            {path.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-white/50 mb-5 leading-relaxed">
          {path.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {path.features.map((feature) => (
            <span
              key={feature}
              className={`
                px-3 py-1 rounded-full text-xs font-medium
                transition-all duration-300
                ${isSelected 
                  ? 'bg-blue-500/20 text-blue-200' 
                  : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'
                }
              `}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Selection indicator */}
        <div className={`
          absolute right-6 top-1/2 -translate-y-1/2
          flex items-center gap-2
          transition-all duration-300
          ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
        `}>
          <span className="text-sm font-medium text-blue-300">Selected</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse-ring">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.button>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PathSelection({ onSelect, isLoading = false }: PathSelectionProps) {
  const [selectedPath, setSelectedPath] = useState<PathType | null>(null);
  const [hoveredPath, setHoveredPath] = useState<PathType | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelect = useCallback((pathId: PathType) => {
    setSelectedPath(pathId);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedPath || isLoading) return;
    
    setIsConfirming(true);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelect(selectedPath);
    }, 300);
  }, [selectedPath, isLoading, onSelect]);

  const handleHover = useCallback((pathId: PathType, hovered: boolean) => {
    setHoveredPath(hovered ? pathId : null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-base)]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Radial gradient from top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,102,255,0.15),transparent)]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-300">Welcome</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Choose Your{' '}
            <span className="text-gradient-blue">Path</span>
          </h1>
          
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Select how you'd like to explore. Each path offers a unique, 
            tailored experience designed just for you.
          </p>
        </motion.div>

        {/* Path Cards Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
          {paths.map((path, index) => (
            <PathCard
              key={path.id}
              path={path}
              isSelected={selectedPath === path.id}
              isHovered={hoveredPath === path.id}
              onSelect={() => handleSelect(path.id)}
              onHover={(hovered) => handleHover(path.id, hovered)}
              index={index}
            />
          ))}
        </div>

        {/* Confirm Button */}
        <AnimatePresence>
          {selectedPath && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              <button
                onClick={handleConfirm}
                disabled={isLoading || isConfirming}
                className={`
                  group relative inline-flex items-center gap-3 
                  px-8 py-4 rounded-xl
                  text-lg font-semibold text-white
                  transition-all duration-300
                  ${isConfirming 
                    ? 'bg-blue-600 scale-95' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
                  }
                `}
                style={{
                  boxShadow: '0 4px 30px rgba(0, 102, 255, 0.4)',
                }}
              >
                {isConfirming ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <span>Continue as {paths.find(p => p.id === selectedPath)?.title}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <p className="text-sm text-white/30">
                This choice will customize your experience
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer note */}
      <div className="relative z-10 text-center py-6">
        <p className="text-xs text-white/20">
          Once you proceed, navigation will be guided forward only
        </p>
      </div>
    </div>
  );
}

export default PathSelection;
