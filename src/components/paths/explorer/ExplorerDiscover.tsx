'use client';

/**
 * ============================================================================
 * EXPLORER PATH - PREMIUM COSMIC DESIGN
 * ============================================================================
 * 
 * Mysterious, adventurous discovery experience with cosmic
 * purple/pink palette and exploration-focused UI.
 */

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Sparkles,
  Code,
  Briefcase,
  GraduationCap,
  Coffee,
  ArrowRight,
  Eye,
  Star,
  Rocket,
  Map,
  Telescope
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface InterestArea {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

// ============================================================================
// DATA
// ============================================================================

const interestAreas: InterestArea[] = [
  {
    id: 'technical',
    icon: Code,
    title: 'Technical Work',
    description: 'See the projects, technologies, and engineering principles I use',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'professional',
    icon: Briefcase,
    title: 'Professional Background',
    description: 'My career journey, experience, and professional achievements',
    color: 'from-fuchsia-500 to-purple-500',
  },
  {
    id: 'learning',
    icon: GraduationCap,
    title: 'Learning & Growth',
    description: 'How I approach learning and what resources helped me grow',
    color: 'from-pink-500 to-fuchsia-500',
  },
  {
    id: 'personal',
    icon: Coffee,
    title: 'Personal Side',
    description: 'Beyond the code—interests, philosophy, and what drives me',
    color: 'from-violet-500 to-purple-500',
  },
];

const quickFacts = [
  { label: 'Years Coding', value: '5+', icon: Code },
  { label: 'Projects Built', value: '20+', icon: Rocket },
  { label: 'Technologies', value: '15+', icon: Telescope },
  { label: 'Coffees/Day', value: '☕☕☕', icon: Coffee },
];

// ============================================================================
// COSMIC STAR FIELD
// ============================================================================

const CosmicStarField = memo(function CosmicStarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static stars */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-20 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"
          style={{
            top: `${20 + i * 30}%`,
            rotate: -45,
          }}
          initial={{ left: '-10%', opacity: 0 }}
          animate={{ left: '110%', opacity: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 3 + i * 4,
            repeatDelay: 8 + i * 2,
          }}
        />
      ))}
    </div>
  );
});

// ============================================================================
// PREMIUM INTEREST CARD
// ============================================================================

interface InterestCardProps {
  area: InterestArea;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const InterestCard = memo(function InterestCard({ area, isSelected, onSelect, index }: InterestCardProps) {
  const Icon = area.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      className={`
        group relative overflow-hidden p-6 rounded-2xl text-left
        transition-all duration-500 border
        ${isSelected
          ? 'bg-white/[0.08] border-purple-500/50 ring-2 ring-purple-500/30 shadow-xl shadow-purple-500/10'
          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-purple-500/20'
        }
      `}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 ${isSelected ? 'opacity-10' : ''} group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Sparkle effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${30 + i * 20}%`,
              top: `${20 + i * 25}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <Star className="w-3 h-3 text-purple-400/50" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{area.title}</h3>
        <p className="text-sm text-white/50 leading-relaxed">{area.description}</p>

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Eye className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom shine line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ExplorerDiscoverProps {
  onComplete: () => void;
}

export function ExplorerDiscover({ onComplete }: ExplorerDiscoverProps) {
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0510] via-[#0d0815] to-[#08050f] text-white flex flex-col relative overflow-hidden">
      {/* Premium Cosmic Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/15 via-fuchsia-600/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-pink-600/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-violet-500/8 to-transparent rounded-full blur-3xl" />
        
        {/* Star field */}
        <CosmicStarField />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            {/* Animated Compass Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 15 }}
              className="relative inline-flex items-center justify-center w-24 h-24 mb-8"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Compass className="w-12 h-12 text-white" />
                </motion.div>
              </div>
              
              {/* Orbiting elements */}
              <motion.div
                className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center"
                animate={{
                  rotate: 360,
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '60px 60px' }}
              >
                <Star className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[0.95] tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Welcome,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Explorer!
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            >
              Curious minds welcome! Let&apos;s discover what interests you most.
              This is your personalized journey through my world.
            </motion.p>
          </motion.div>

          {/* Quick Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {quickFacts.map((fact, i) => {
              const FactIcon = fact.icon;
              return (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">{fact.value}</div>
                  <div className="text-xs text-white/40 flex items-center justify-center gap-2">
                    <FactIcon className="w-3 h-3 text-purple-400" />
                    {fact.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Interest Areas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/50" />
              <h2 className="text-xl font-semibold text-white text-center flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-400" />
                What interests you?
                <span className="text-white/40 text-sm">(Select any)</span>
              </h2>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/50" />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {interestAreas.map((area, index) => (
                <InterestCard
                  key={area.id}
                  area={area}
                  isSelected={selectedAreas.has(area.id)}
                  onSelect={() => toggleArea(area.id)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* Personalized Message */}
          <AnimatePresence>
            {selectedAreas.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 border border-purple-500/20 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-white/70 text-lg">
                    Great choices! I&apos;ll show you the most relevant highlights based on your interests.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
        className="sticky bottom-0 px-6 py-5 bg-black/80 backdrop-blur-xl border-t border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-sm text-white/40">
            {selectedAreas.size === 0 
              ? 'Select interests for a personalized experience, or continue to see everything.'
              : `${selectedAreas.size} area${selectedAreas.size > 1 ? 's' : ''} selected`
            }
          </p>

          <button
            onClick={onComplete}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ExplorerDiscover;
