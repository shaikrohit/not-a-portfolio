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
  ArrowRight
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
      className="group relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="font-medium text-white mb-1">{method.label}</h3>
        <p className="text-blue-400 text-sm mb-2 font-mono">{method.value}</p>
        <p className="text-xs text-white/30">{method.description}</p>

        <ExternalLink className="absolute bottom-5 right-5 w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors" />
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
      className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
    >
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div>
        <h4 className="font-medium text-white mb-1">{type.title}</h4>
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30 mb-6"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Let's Build Something Together
            </h1>
            <p className="text-white/50 max-w-2xl mx-auto">
              You've seen my philosophy, my stack, and my work. 
              Now let's turn ideas into reality.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-white mb-6"
              >
                Reach Out
              </motion.h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
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
                className="text-xl font-semibold text-white mb-6"
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
            className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white font-medium">Quick Response</span>
            </div>
            <p className="text-white/50 text-sm">
              I typically respond within 24-48 hours. For urgent matters, 
              Twitter DMs work best.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 glass-strong border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-center">
          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-green-400"
            >
              <Check className="w-5 h-5" />
              <span className="font-medium">Journey Complete!</span>
            </motion.div>
          ) : (
            <button
              onClick={handleComplete}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-blue-500/30"
            >
              <span className="text-lg">Complete Developer Journey</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeveloperConnect;
