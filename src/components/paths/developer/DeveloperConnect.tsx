'use client';

/**
 * ============================================================================
 * DEVELOPER PATH - CONNECT STEP (FINAL)
 * ============================================================================
 *
 * Final step with contact options, collaboration preferences,
 * and call-to-action for reaching out.
 */

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  MessageSquare,
  Code2,
  Coffee,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ContactMethod {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  color: string;
  description: string;
}

interface CollaborationType {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

// ============================================================================
// DATA
// ============================================================================

const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: 'hello@example.com',
    href: 'mailto:hello@example.com',
    color: 'from-blue-500 to-blue-400',
    description: 'Best for detailed inquiries',
  },
  {
    id: 'github',
    icon: Github,
    label: 'GitHub',
    value: '@username',
    href: 'https://github.com/username',
    color: 'from-gray-500 to-gray-400',
    description: 'Check out my code',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/username',
    href: 'https://linkedin.com/in/username',
    color: 'from-blue-600 to-blue-500',
    description: 'Professional network',
  },
  {
    id: 'twitter',
    icon: Twitter,
    label: 'Twitter/X',
    value: '@username',
    href: 'https://twitter.com/username',
    color: 'from-sky-500 to-sky-400',
    description: 'Quick thoughts & updates',
  },
];

const collaborationTypes: CollaborationType[] = [
  {
    id: 'opensource',
    icon: Code2,
    title: 'Open Source',
    description: 'Contributing to meaningful projects that help developers',
  },
  {
    id: 'consulting',
    icon: MessageSquare,
    title: 'Technical Consulting',
    description: 'Architecture reviews, code audits, and best practices',
  },
  {
    id: 'mentoring',
    icon: Coffee,
    title: 'Mentorship',
    description: 'Helping developers level up their skills',
  },
  {
    id: 'fulltime',
    icon: Calendar,
    title: 'Full-time Opportunities',
    description: 'Always open to discussing exciting challenges',
  },
];

// ============================================================================
// CONTACT CARD
// ============================================================================

interface ContactCardProps {
  method: ContactMethod;
  index: number;
}

const ContactCard = memo(function ContactCard({ method, index }: ContactCardProps) {
  const [copied, setCopied] = useState(false);
  const Icon = method.icon;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(method.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.a
      href={method.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-white/10"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
      />

      <div className="relative p-5">
        <div className="mb-3 flex items-start justify-between">
          <div
            className={`h-10 w-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>

          <button
            onClick={handleCopy}
            className="rounded-lg bg-white/5 p-2 text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
            title="Copy"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <h3 className="mb-1 font-medium text-white">{method.label}</h3>
        <p className="mb-2 font-mono text-sm text-blue-400">{method.value}</p>
        <p className="text-xs text-white/30">{method.description}</p>

        <ExternalLink className="absolute bottom-5 right-5 h-4 w-4 text-white/10 transition-colors group-hover:text-white/30" />
      </div>
    </motion.a>
  );
});

// ============================================================================
// COLLABORATION CARD
// ============================================================================

interface CollaborationCardProps {
  type: CollaborationType;
  index: number;
}

const CollaborationCard = memo(function CollaborationCard({ type, index }: CollaborationCardProps) {
  const Icon = type.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
      className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
        <Icon className="h-5 w-5 text-blue-400" />
      </div>
      <div>
        <h4 className="mb-1 font-medium text-white">{type.title}</h4>
        <p className="text-sm text-white/40">{type.description}</p>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface DeveloperConnectProps {
  onComplete: () => void;
}

export function DeveloperConnect({ onComplete }: DeveloperConnectProps) {
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
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>

            <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Let's Build Something Together
            </h1>
            <p className="mx-auto max-w-2xl text-white/50">
              You've seen my philosophy, my stack, and my work. Now let's turn ideas into reality.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Methods */}
            <div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 text-xl font-semibold text-white"
              >
                Reach Out
              </motion.h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {contactMethods.map((method, index) => (
                  <ContactCard key={method.id} method={method} index={index} />
                ))}
              </div>
            </div>

            {/* Collaboration Types */}
            <div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 text-xl font-semibold text-white"
              >
                Open To
              </motion.h2>

              <div className="space-y-3">
                {collaborationTypes.map((type, index) => (
                  <CollaborationCard key={type.id} type={type} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-6 text-center"
          >
            <div className="mb-2 flex items-center justify-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="font-medium text-white">Quick Response</span>
            </div>
            <p className="text-sm text-white/50">
              I typically respond within 24-48 hours. For urgent matters, Twitter DMs work best.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="glass-strong sticky bottom-0 border-t border-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-4">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-green-400"
            >
              <Check className="h-5 w-5" />
              <span className="font-medium">Journey Complete!</span>
            </motion.div>
          ) : (
            <button
              onClick={handleComplete}
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-medium text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:from-blue-500 hover:to-blue-400"
            >
              <span className="text-lg">Complete Developer Journey</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeveloperConnect;
