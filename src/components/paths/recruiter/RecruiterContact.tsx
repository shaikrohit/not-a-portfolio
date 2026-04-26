'use client';

/**
 * ============================================================================
 * RECRUITER PATH - CONTACT STEP (FINAL)
 * ============================================================================
 *
 * Professional contact page with scheduling options,
 * preferred communication methods, and quick actions.
 */

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Linkedin,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  ArrowRight,
  Check,
  Copy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ContactOption {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string;
  action: string;
  href: string;
  primary?: boolean;
}

interface QuickInfo {
  icon: LucideIcon;
  label: string;
  value: string;
}

// ============================================================================
// DATA
// ============================================================================

const contactOptions: ContactOption[] = [
  {
    id: 'email',
    icon: Mail,
    label: 'Email',
    value: 'hello@example.com',
    action: 'Send Email',
    href: 'mailto:hello@example.com?subject=Opportunity%20Discussion',
    primary: true,
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/username',
    action: 'View Profile',
    href: 'https://linkedin.com/in/username',
  },
  {
    id: 'calendar',
    icon: Calendar,
    label: 'Schedule a Call',
    value: 'Book 30-min intro call',
    action: 'Open Calendar',
    href: 'https://calendly.com/username',
  },
];

const quickInfo: QuickInfo[] = [
  { icon: MapPin, label: 'Location', value: 'Remote / San Francisco' },
  { icon: Clock, label: 'Availability', value: '2 weeks notice' },
  { icon: Briefcase, label: 'Preference', value: 'Full-time / Contract' },
];

const lookingFor = [
  'Engineering leadership roles',
  'Early-stage startup challenges',
  'Product-focused engineering teams',
  'Remote-first companies',
  'Impactful technical problems',
];

// ============================================================================
// CONTACT CARD
// ============================================================================

interface ContactCardProps {
  option: ContactOption;
  index: number;
}

const ContactCard = memo(function ContactCard({ option, index }: ContactCardProps) {
  const [copied, setCopied] = useState(false);
  const Icon = option.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(option.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl ${
        option.primary
          ? 'border-2 border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-blue-500/10'
          : 'border border-white/5 bg-white/[0.02]'
      } `}
    >
      {option.primary && (
        <div className="absolute right-3 top-3 rounded bg-blue-500 px-2 py-0.5 text-xs text-white">
          Preferred
        </div>
      )}

      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              option.primary ? 'bg-blue-500' : 'bg-white/5'
            }`}
          >
            <Icon className={`h-6 w-6 ${option.primary ? 'text-white' : 'text-white/50'}`} />
          </div>
          <div>
            <div className="font-semibold text-white">{option.label}</div>
            <div className="text-sm text-white/40">{option.value}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              option.primary
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            } `}
          >
            {option.action}
          </a>
          {option.id === 'email' && (
            <button
              onClick={handleCopy}
              className="rounded-lg bg-white/5 px-3 py-2.5 text-white/50 transition-colors hover:bg-white/10"
              title="Copy email"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RecruiterContactProps {
  onComplete: () => void;
}

export function RecruiterContact({ onComplete }: RecruiterContactProps) {
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
            className="mb-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30"
            >
              <Briefcase className="h-8 w-8 text-white" />
            </motion.div>

            <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Let's Discuss Opportunities
            </h1>
            <p className="mx-auto max-w-2xl text-white/50">
              Thank you for reviewing my profile. I'm excited to hear about what you're building and
              how I might contribute.
            </p>
          </motion.div>

          {/* Quick Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 flex flex-wrap justify-center gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
          >
            {quickInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4 text-blue-400" />
                  <span className="text-white/40">{info.label}:</span>
                  <span className="text-white">{info.value}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Contact Options */}
            <div className="space-y-4 lg:col-span-3">
              {contactOptions.map((option, index) => (
                <ContactCard key={option.id} option={option} index={index} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:col-span-2">
              {/* What I'm Looking For */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <h3 className="mb-4 text-lg font-semibold text-white">What I'm Looking For</h3>
                <ul className="space-y-2">
                  {lookingFor.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Response Time */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Quick Response</div>
                    <div className="text-xs text-white/40">Usually within 24 hours</div>
                  </div>
                </div>
              </motion.div>

              {/* Download Resume */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 p-4 text-white/70 transition-colors hover:bg-white/10"
              >
                <Download className="h-5 w-5" />
                Download Resume (PDF)
              </motion.button>
            </div>
          </div>
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
              <span className="text-lg">Complete Recruiter Journey</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterContact;
