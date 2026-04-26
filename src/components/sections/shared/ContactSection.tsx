'use client';

/**
 * ============================================================================
 * CONTACT SECTION (Shared)
 * ============================================================================
 *
 * @description Contact form and social links.
 *              Shared between Developer, Recruiter, Student, and Explorer.
 *
 * @usage
 * ```tsx
 * import { ContactSection } from '@/components/sections/shared';
 *
 * <ContactSection />
 * ```
 * ============================================================================
 */

import React, { useState } from 'react';
import { Send, Github, Linkedin, Mail, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Text, Card, Button, Input, FadeIn, StaggerChildren, StaggerItem } from '@/components/ui';
import { profile } from '@/content';

// ============================================================================
// TYPES
// ============================================================================

interface SocialLink {
  name: string;
  url: string;
  icon: LucideIcon;
}

// ============================================================================
// DATA
// ============================================================================

const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: profile.github, icon: Github },
  { name: 'LinkedIn', url: profile.linkedin, icon: Linkedin },
  { name: 'Email', url: `mailto:${profile.email}`, icon: Mail },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * SocialCard
 *
 * A social media link card.
 */
function SocialCard({ link }: { link: SocialLink }) {
  const Icon = link.icon;

  return (
    <a
      href={link.url}
      target={link.name !== 'Email' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group"
    >
      <Card variant="interactive" padding="md" className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-neutral-500 transition-colors group-hover:text-accent" />
        <Text variant="body" className="transition-colors group-hover:text-accent">
          {link.name}
        </Text>
      </Card>
    </a>
  );
}

/**
 * ContactForm
 *
 * Simple contact form with validation.
 */
function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card padding="lg" className="text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <Text variant="h3" className="mb-2">
          Message Sent!
        </Text>
        <Text variant="body" muted>
          Thanks for reaching out. I'll get back to you soon.
        </Text>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Your name"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          required
        />
        <div>
          <label className="mb-2 block text-sm font-medium">Message</label>
          <textarea
            className="w-full resize-none rounded-lg border border-transparent bg-neutral-100 px-4 py-3 focus:border-accent focus:outline-none dark:bg-neutral-900"
            rows={4}
            placeholder="Your message..."
            value={formState.message}
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            required
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isLoading}
          leftIcon={<Send className="h-4 w-4" />}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ContactSection
 *
 * Contact form and social links.
 * Shown on all visitor paths at the bottom.
 */
export function ContactSection() {
  return (
    <section className="section bg-neutral-50 dark:bg-neutral-900/50">
      <div className="container-narrow">
        {/* Header */}
        <FadeIn className="mb-12 text-center">
          <Text variant="overline" className="mb-4">
            Get in Touch
          </Text>
          <Text variant="h2" className="mb-4" balance>
            Let's Connect
          </Text>
          <Text variant="body-large" muted className="mx-auto max-w-xl">
            Have a question, project idea, or just want to say hi? I'd love to hear from you.
          </Text>
        </FadeIn>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left: Contact Form */}
          <FadeIn>
            <ContactForm />
          </FadeIn>

          {/* Right: Social Links */}
          <div>
            <FadeIn>
              <Text variant="h3" className="mb-6">
                Or find me on
              </Text>
            </FadeIn>
            <StaggerChildren className="space-y-3">
              {socialLinks.map((link) => (
                <StaggerItem key={link.name}>
                  <SocialCard link={link} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
