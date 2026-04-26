'use client';

/**
 * ============================================================================
 * DEVELOPER PATH - PREMIUM TERMINAL AESTHETIC
 * ============================================================================
 *
 * Inspired by GitHub, Linear, and VS Code.
 * Features animated terminal, syntax highlighting, and code aesthetics.
 */

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, ArrowRight, GitBranch, Layers } from 'lucide-react';

// ============================================================================
// ANIMATED TERMINAL WITH REALISTIC EFFECTS
// ============================================================================

const codeSnippet = `// Let's build something amazing together
const developer = {
  name: "Shaik Rohit",
  role: "Full Stack Engineer",
  
  expertise: {
    frontend: ["React", "Next.js", "TypeScript"],
    backend: ["Node.js", "Python", "PostgreSQL"],
    cloud: ["AWS", "Vercel", "Docker"]
  },
  
  philosophy: {
    code: "Clarity over cleverness",
    design: "User-first thinking",
    shipping: "Done > Perfect"
  },
  
  async build(idea) {
    const solution = await this.architect(idea);
    return solution.deploy();
  }
};

export default developer;`;

function AnimatedTerminal() {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= codeSnippet.length) {
        setDisplayedCode(codeSnippet.slice(0, index));
        const lines = codeSnippet.slice(0, index).split('\n');
        setCurrentLine(lines.length);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20 blur-xl transition duration-500 group-hover:opacity-30" />

      {/* Terminal Window */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#0d1117] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.4)]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.4)]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.4)]" />
            </div>
            <span className="ml-4 font-mono text-xs text-white/30">developer.ts</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-3 w-3 text-white/20" />
            <span className="font-mono text-xs text-white/20">main</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="min-h-[400px] overflow-hidden bg-gradient-to-b from-[#0d1117] to-[#010409] p-6">
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              {displayedCode.split('\n').map((line, i) => (
                <motion.div
                  key={i}
                  className="flex"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <span className="w-8 flex-shrink-0 select-none pr-4 text-right text-white/20">
                    {i + 1}
                  </span>
                  <span className="flex-1">{highlightSyntax(line)}</span>
                </motion.div>
              ))}
            </code>
          </pre>

          {/* Cursor */}
          {!isComplete && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="ml-12 inline-block h-5 w-2 bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.5)]"
            />
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between border-t border-white/5 bg-[#161b22] px-4 py-2 font-mono text-xs text-white/30">
          <span>TypeScript</span>
          <span>
            Line {currentLine}, Col{' '}
            {displayedCode.length > 0 ? displayedCode.split('\n').pop()?.length || 0 : 0}
          </span>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute -right-4 top-20 rounded-lg border border-green-500/30 bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400"
      >
        No errors
      </motion.div>
    </div>
  );
}

// Enhanced syntax highlighting
function highlightSyntax(line: string): React.ReactNode {
  if (line.trim().startsWith('//')) {
    return <span className="italic text-white/30">{line}</span>;
  }

  const keywords = [
    'const',
    'export',
    'default',
    'true',
    'false',
    'async',
    'await',
    'return',
    'this',
  ];

  // Simple tokenization
  const tokens = line.split(/(\s+|[{}[\](),.:;]|"[^"]*")/);

  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith('"') && token.endsWith('"')) {
          return (
            <span key={i} className="text-[#a5d6ff]">
              {token}
            </span>
          );
        }
        if (keywords.includes(token)) {
          return (
            <span key={i} className="text-[#ff7b72]">
              {token}
            </span>
          );
        }
        if (token.includes(':')) {
          return (
            <span key={i} className="text-[#79c0ff]">
              {token}
            </span>
          );
        }
        if (/^[A-Z]/.test(token)) {
          return (
            <span key={i} className="text-[#ffa657]">
              {token}
            </span>
          );
        }
        return (
          <span key={i} className="text-white/80">
            {token}
          </span>
        );
      })}
    </>
  );
}

// ============================================================================
// FEATURE CARDS WITH ICONS
// ============================================================================

const features = [
  {
    icon: Terminal,
    title: 'Code Architecture',
    description: 'Deep dive into system design and implementation patterns',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Cpu,
    title: 'Technical Philosophy',
    description: 'Principles that guide engineering decisions',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    icon: Layers,
    title: 'Real Projects',
    description: 'Production code and lessons learned',
    gradient: 'from-purple-500 to-pink-500',
  },
];

const FeatureCard = memo(function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 + index * 0.15, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:border-cyan-500/30"
    >
      {/* Hover glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
      />

      <div
        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 flex items-center justify-center shadow-lg`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{feature.description}</p>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface DeveloperIntroProps {
  onComplete: () => void;
}

export function DeveloperIntro({ onComplete }: DeveloperIntroProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Background gradient specific to developer path */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Content */}
      <div className="relative flex flex-1 items-center px-4 py-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2"
              >
                <Terminal className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">Developer Mode Activated</span>
              </motion.div>

              <h1 className="mb-8 text-5xl font-bold leading-[1.1] text-white md:text-6xl lg:text-7xl">
                Welcome to the{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Technical Deep Dive
                </span>
              </h1>

              <p className="mb-12 max-w-xl text-xl leading-relaxed text-white/50">
                You've chosen the developer path. Here, we explore code architecture, engineering
                philosophy, and the technical decisions behind real-world projects.
              </p>

              {/* Feature Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {features.map((feature, index) => (
                  <FeatureCard key={feature.title} feature={feature} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AnimatedTerminal />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 border-t border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <p className="text-sm text-white/40">Ready to explore the technical side?</p>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0.5 }}
            onClick={() => isReady && onComplete()}
            disabled={!isReady}
            className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ${
              isReady
                ? 'cursor-pointer bg-gradient-to-r from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500'
                : 'cursor-wait bg-white/10'
            } `}
          >
            {isReady ? (
              <>
                <span className="relative z-10">Start Journey</span>
                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Initializing...</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default DeveloperIntro;
