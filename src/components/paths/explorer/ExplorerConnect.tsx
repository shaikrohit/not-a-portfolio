'use client';

/**
 * ============================================================================
 * EXPLORER PATH - CONNECT STEP (FINAL)
 * ============================================================================
 *
 * Final connection page with multiple contact options
 * and a warm closing message.
 */

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Mail,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  ArrowRight,
  Check,
  Sparkles,
  Heart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface SocialLink {
  id: string;
  icon: LucideIcon;
  label: string;
  handle: string;
  href: string;
  color: string;
}

// ============================================================================
// DATA
// ============================================================================

const socialLinks: SocialLink[] = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    handle: 'hello@example.com',
    href: 'mailto:hello@example.com',
    color: 'from-blue-500 to-blue-400',
  },
  {
    id: 'github',
    icon: Github,
    label: 'GitHub',
    handle: '@username',
    href: 'https://github.com/username',
    color: 'from-gray-500 to-gray-400',
  },
  {
    id: 'twitter',
    icon: Twitter,
    label: 'Twitter/X',
    handle: '@username',
    href: 'https://twitter.com/username',
    color: 'from-sky-500 to-sky-400',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    handle: '/in/username',
    href: 'https://linkedin.com/in/username',
    color: 'from-blue-600 to-blue-500',
  },
];

const funFacts = [
  "I've read your bio and appreciate you exploring my site",
  'Feel free to reach out about anything - work or just to chat',
  'I typically respond within 24 hours',
  'I love meeting new people in tech!',
];

// ============================================================================
// SOCIAL LINK CARD
// ============================================================================

interface SocialLinkCardProps {
  link: SocialLink;
  index: number;
}

const SocialLinkCard = memo(function SocialLinkCard({ link, index }: SocialLinkCardProps) {
  const Icon = link.icon;

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white transition-colors group-hover:text-blue-400">
            {link.label}
          </h4>
          <p className="font-mono text-sm text-white/40">{link.handle}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-white/20 transition-all group-hover:translate-x-1 group-hover:text-white/40" />
      </div>
    </motion.a>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface ExplorerConnectProps {
  onComplete: () => void;
}

export function ExplorerConnect({ onComplete }: ExplorerConnectProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleComplete = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-2xl shadow-blue-500/30"
            >
              <Compass className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Thanks for Exploring! 🎉
            </h1>
            <p className="mx-auto max-w-xl text-xl text-white/50">
              You've reached the end of your journey. I'd love to stay connected—here's how to find
              me.
            </p>
          </motion.div>

          {/* Social Links */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {socialLinks.map((link, index) => (
              <SocialLinkCard key={link.id} link={link} index={index} />
            ))}
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              <h3 className="font-medium text-white">A Few Things to Know</h3>
            </div>
            <ul className="space-y-2">
              {funFacts.map((fact, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-2 text-white/50"
                >
                  <Check className="h-4 w-4 flex-shrink-0 text-green-400" />
                  {fact}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Closing Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-sm text-white/50">Built with curiosity and lots of coffee</span>
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-4">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-green-400"
            >
              <Check className="h-5 w-5" />
              <span className="font-medium">Exploration Complete! See you around! ✨</span>
            </motion.div>
          ) : (
            <button
              onClick={handleComplete}
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 px-8 py-4 font-medium text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:from-blue-500 hover:via-indigo-400 hover:to-purple-400"
            >
              <span className="text-lg">Complete Explorer Journey</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExplorerConnect;
