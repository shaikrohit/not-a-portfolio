'use client';

/**
 * ============================================================================
 * RECRUITER PATH - PREMIUM EXECUTIVE DESIGN
 * ============================================================================
 * 
 * Clean, professional, executive-level presentation.
 * Inspired by LinkedIn Premium and executive portfolios.
 */

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Download,
  ArrowRight,
  Award,
  Users,
  Calendar,
  TrendingUp,
  Star,
  Building2,
  Target
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface QuickStat {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
}

// ============================================================================
// DATA
// ============================================================================

const quickStats: QuickStat[] = [
  {
    icon: <Briefcase className="w-5 h-5" />,
    label: 'Experience',
    value: '5+ Years',
    subtext: 'Full-stack development',
  },
  {
    icon: <Award className="w-5 h-5" />,
    label: 'Specialization',
    value: 'React & Node.js',
    subtext: 'TypeScript expert',
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: 'Team Size',
    value: 'Up to 15',
    subtext: 'Led cross-functional teams',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: 'Availability',
    value: '2 Weeks',
    subtext: 'Notice period',
  },
];

const highlights = [
  'Architected and shipped 10+ production applications',
  'Led frontend modernization reducing load time by 60%',
  'Mentored 5+ junior developers to senior roles',
  'Strong background in system design and scalability',
];

// ============================================================================
// ANIMATED COUNTER
// ============================================================================

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = memo(function AnimatedCounter({ 
  target, 
  suffix = '', 
  duration = 1500 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
});

// ============================================================================
// STATUS BADGE - PREMIUM VERSION
// ============================================================================

const StatusBadge = memo(function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 shadow-lg shadow-green-500/10"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </span>
      <span className="text-sm text-green-300 font-semibold">Open to Opportunities</span>
    </motion.div>
  );
});

// ============================================================================
// PREMIUM STAT CARD
// ============================================================================

interface StatCardProps {
  stat: QuickStat;
  index: number;
}

const StatCard = memo(function StatCard({ stat, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            {stat.icon}
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
        <div className="text-sm text-blue-300 mb-1">{stat.label}</div>
        {stat.subtext && (
          <div className="text-xs text-white/40">{stat.subtext}</div>
        )}
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecruiterIntroProps {
  onComplete: () => void;
}

export function RecruiterIntro({ onComplete }: RecruiterIntroProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0d1020] to-[#0a0a15] text-white flex flex-col relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/8 via-blue-500/4 to-transparent rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <StatusBadge />
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mt-8 mb-6 leading-[0.95] tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Executive
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                Summary
              </span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/50">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <MapPin className="w-4 h-4 text-blue-400" />
                San Francisco, CA
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <Clock className="w-4 h-4 text-blue-400" />
                Available for immediate start
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
                <Building2 className="w-4 h-4 text-blue-400" />
                Remote / Hybrid
              </span>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {quickStats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Key Highlights */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Key Achievements
                </h2>
              </div>
              <ul className="space-y-4">
                {highlights.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/70 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Impact Numbers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Impact Numbers
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-white/50">Applications Shipped</span>
                    <span className="text-3xl font-bold text-blue-400">
                      <AnimatedCounter target={10} suffix="+" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-white/50">Performance Improvement</span>
                    <span className="text-3xl font-bold text-emerald-400">
                      <AnimatedCounter target={60} suffix="%" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-white/50">Developers Mentored</span>
                    <span className="text-3xl font-bold text-amber-400">
                      <AnimatedCounter target={5} suffix="+" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Goals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                What I&apos;m Looking For
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {['Senior/Lead Engineering Roles', 'High-Impact Product Teams', 'Growth-Stage Companies'].map((item, i) => (
                <div key={i} className="px-4 py-3 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.06] text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
        className="sticky bottom-0 px-6 py-5 bg-black/80 backdrop-blur-xl border-t border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button className="group flex items-center gap-3 px-5 py-2.5 text-white/60 hover:text-white transition-all duration-300 rounded-xl hover:bg-white/[0.03]">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Download Resume</span>
          </button>
          
          <button
            onClick={onComplete}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>View Full Experience</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default RecruiterIntro;
