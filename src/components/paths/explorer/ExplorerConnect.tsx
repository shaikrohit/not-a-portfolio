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
  Heart
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
  'I\'ve read your bio and appreciate you exploring my site',
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
      className="group relative overflow-hidden p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      <div className="relative flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">
            {link.label}
          </h4>
          <p className="text-sm text-white/40 font-mono">{link.handle}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-2xl shadow-blue-500/30 mb-6"
            >
              <Compass className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Thanks for Exploring! 🎉
            </h1>
            <p className="text-xl text-white/50 max-w-xl mx-auto">
              You've reached the end of your journey. 
              I'd love to stay connected—here's how to find me.
            </p>
          </motion.div>

          {/* Social Links */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {socialLinks.map((link, index) => (
              <SocialLinkCard key={link.id} link={link} index={index} />
            ))}
          </div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-5 h-5 text-blue-400" />
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
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-white/50">
                Built with curiosity and lots of coffee
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-center">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-green-400"
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Exploration Complete! See you around! ✨</span>
            </motion.div>
          ) : (
            <button
              onClick={handleComplete}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:from-blue-500 hover:via-indigo-400 hover:to-purple-400 transition-all duration-300 shadow-xl shadow-blue-500/30"
            >
              <span className="text-lg">Complete Explorer Journey</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExplorerConnect;
