'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Check,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Code2,
  Briefcase,
  GraduationCap,
  Compass,
} from 'lucide-react';
import { useVisitorStore } from '@/store';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import type { VisitorType, ContactFormData, ContactResponse } from '@/types';

export type FormStatus = 'pristine' | 'validating' | 'submitting' | 'success' | 'error';

export interface FormValues {
  name: string;
  email: string;
  message: string;
  visitorType: VisitorType;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;
export type FormTouched = Partial<Record<keyof FormValues, boolean>>;

const PERSONA_OPTIONS: Array<{ id: VisitorType; label: string; icon: React.ElementType }> = [
  { id: 'developer', label: 'Developer', icon: Code2 },
  { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'explorer', label: 'Explorer', icon: Compass },
];

export function validateField(field: keyof FormValues, value: string): string | undefined {
  switch (field) {
    case 'name': {
      const trimmed = value.trim();
      if (!trimmed) return 'Name is required.';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      if (trimmed.length > 100) return 'Name cannot exceed 100 characters.';
      if (!/^[\p{L}\p{M}\s.'’`-]+$/u.test(trimmed)) {
        return 'Name contains invalid characters.';
      }
      return undefined;
    }
    case 'email': {
      const trimmed = value.trim();
      if (!trimmed) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
        return 'Please enter a valid email address (e.g. name@domain.com).';
      }
      if (trimmed.length > 254) return 'Email address is too long.';
      return undefined;
    }
    case 'message': {
      const trimmed = value.trim();
      if (!trimmed) return 'Message is required.';
      if (trimmed.length < 10) return 'Message must be at least 10 characters.';
      if (trimmed.length > 5000) return 'Message cannot exceed 5000 characters.';
      return undefined;
    }
    case 'visitorType': {
      const validTypes: VisitorType[] = ['developer', 'recruiter', 'student', 'explorer'];
      if (!validTypes.includes(value as VisitorType)) {
        return 'Please select a valid persona.';
      }
      return undefined;
    }
    default:
      return undefined;
  }
}

export function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  (['name', 'email', 'message', 'visitorType'] as const).forEach((field) => {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  });
  return errors;
}

export function ContactForm({ className }: { className?: string }) {
  const storeVisitorType = useVisitorStore((state) => state.visitorType);
  const session = useVisitorStore((state) => state.session);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [status, setStatus] = useState<FormStatus>('pristine');
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    message: '',
    visitorType: storeVisitorType || 'developer',
  });
  const [touched, setTouched] = useState<FormTouched>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [srAnnouncement, setSrAnnouncement] = useState<string>('');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const successCardRef = useRef<HTMLDivElement>(null);

  // Sync visitor type if store updates externally
  useEffect(() => {
    if (storeVisitorType && status === 'pristine') {
      setValues((prev) => ({ ...prev, visitorType: storeVisitorType }));
    }
  }, [storeVisitorType, status]);

  const handleChange = (field: keyof FormValues, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }));

    // If user has already blurred this field, validate in real time
    if (touched[field]) {
      const error = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    if (status === 'error') {
      setStatus('validating');
      setSubmitError(null);
    }
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, values[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields touched
    const allTouched: FormTouched = {
      name: true,
      email: true,
      message: true,
      visitorType: true,
    };
    setTouched(allTouched);

    const validationErrors = validateAll(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setShakeKey((prev) => prev + 1);
      setSrAnnouncement('Form contains errors. Please check the highlighted fields.');

      // Focus first invalid field
      if (validationErrors.name) {
        nameInputRef.current?.focus();
      } else if (validationErrors.email) {
        emailInputRef.current?.focus();
      } else if (validationErrors.message) {
        messageInputRef.current?.focus();
      }
      return;
    }

    setStatus('submitting');
    setSubmitError(null);
    setSrAnnouncement('Sending your message, please wait...');

    try {
      const payload: ContactFormData = {
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        visitorType: values.visitorType,
        sessionId: session?.id,
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: ContactResponse = await res.json().catch(() => ({
        success: false,
        error: 'Invalid response from server.',
      }));

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to deliver message. Please try again.');
      }

      setStatus('success');
      setSrAnnouncement('Message sent successfully. Thank you for reaching out!');
      setTimeout(() => {
        successCardRef.current?.focus();
      }, 100);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setStatus('error');
      setSubmitError(errMsg);
      setSrAnnouncement(`Error: ${errMsg}`);
    }
  };

  const handleReset = () => {
    setValues({
      name: '',
      email: '',
      message: '',
      visitorType: storeVisitorType || 'developer',
    });
    setTouched({});
    setErrors({});
    setSubmitError(null);
    setStatus('pristine');
    setSrAnnouncement('Form reset. Ready for a new message.');
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  const shakeVariants = {
    shake: {
      x: prefersReducedMotion ? [0] : [0, -8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.45, ease: 'easeInOut' },
    },
  };

  const isSubmitting = status === 'submitting';

  return (
    <div className={cn('relative w-full', className)}>
      {/* Screen reader live region */}
      <div role="status" aria-live="polite" className="sr-only">
        {srAnnouncement}
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success-card"
            ref={successCardRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-[var(--surface-card)] p-8 text-center shadow-xl backdrop-blur-md sm:p-12"
          >
            {/* Animated SVG Checkmark */}
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <motion.svg
                className="h-12 w-12"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.circle
                  cx="26"
                  cy="26"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <motion.path
                  d="M16 27L23 34L36 19"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                />
              </motion.svg>
            </div>

            <h3 className="mb-2 font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Message Delivered!
            </h3>
            <p className="mb-2 max-w-md text-base text-[var(--text-secondary)]">
              Thank you,{' '}
              <strong className="font-semibold text-[var(--text-primary)]">{values.name}</strong>.
              Your note has been saved and forwarded to Shaik Rohit.
            </p>
            <p className="mb-8 text-sm text-[var(--text-muted)]">
              A reply will be sent to{' '}
              <span className="font-medium text-[var(--text-primary)]">{values.email}</span> soon.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--surface-elevated)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:border-emerald-500/40 hover:bg-[var(--surface-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <RotateCcw className="h-4 w-4" />
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="contact-form"
            noValidate
            role="form"
            aria-label="Contact form"
            onSubmit={handleSubmit}
            animate={shakeKey > 0 ? 'shake' : undefined}
            variants={shakeVariants}
            className="flex flex-col gap-6 rounded-2xl border border-[var(--border-light)] bg-[var(--surface-card)] p-6 shadow-xl backdrop-blur-md sm:p-8"
          >
            {/* Error Banner */}
            {status === 'error' && submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-300"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
                <div className="flex-1">
                  <p className="font-medium">Transmission Error</p>
                  <p className="mt-0.5 text-xs opacity-90">{submitError}</p>
                  <p className="mt-2 text-xs">
                    You can also email directly at{' '}
                    <a
                      href="mailto:shaik.rohit.official@gmail.com"
                      className="font-medium underline hover:text-rose-500"
                    >
                      shaik.rohit.official@gmail.com
                    </a>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Persona Selector (Radio Group) */}
            <fieldset className="w-full">
              <div className="mb-2 flex items-center justify-between">
                <legend className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  I am visiting as a:
                </legend>
                <span className="text-[11px] text-[var(--text-muted)]">Optional</span>
              </div>
              <div
                role="radiogroup"
                aria-label="Visitor persona"
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {PERSONA_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = values.visitorType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={isSubmitting}
                      onClick={() => handleChange('visitorType', opt.id)}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 font-semibold text-blue-600 shadow-sm dark:text-blue-400'
                          : 'border-[var(--border-light)] bg-transparent text-[var(--text-secondary)] hover:border-neutral-400 hover:text-[var(--text-primary)] dark:hover:border-neutral-600',
                        isSubmitting && 'cursor-not-allowed opacity-60'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Name Input */}
            <div className="w-full">
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Your Name{' '}
                  <span className="text-rose-500" aria-hidden="true">
                    *
                  </span>
                </label>
                {touched.name && !errors.name && values.name.trim().length >= 2 && (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <Check className="h-3.5 w-3.5" /> Valid
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  ref={nameInputRef}
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  disabled={isSubmitting}
                  placeholder="e.g. Alex Chen"
                  value={values.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  aria-required="true"
                  aria-invalid={touched.name && !!errors.name ? 'true' : 'false'}
                  aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                  className={cn(
                    'w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-[var(--text-primary)] backdrop-blur-sm transition-all placeholder:text-[var(--text-muted)] dark:bg-neutral-900/60',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    touched.name && errors.name
                      ? 'border-rose-500 focus-visible:ring-rose-500'
                      : touched.name && values.name.trim().length >= 2
                        ? 'border-emerald-500/60 focus-visible:ring-emerald-500'
                        : 'border-[var(--border-light)] focus-visible:ring-blue-500',
                    isSubmitting && 'cursor-not-allowed opacity-60'
                  )}
                />
                {touched.name && errors.name && (
                  <AlertCircle className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-rose-500" />
                )}
              </div>
              {touched.name && errors.name && (
                <p
                  id="contact-name-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-500"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="w-full">
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Email Address{' '}
                  <span className="text-rose-500" aria-hidden="true">
                    *
                  </span>
                </label>
                {touched.email && !errors.email && values.email.trim().length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <Check className="h-3.5 w-3.5" /> Valid
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  placeholder="alex@example.com"
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-required="true"
                  aria-invalid={touched.email && !!errors.email ? 'true' : 'false'}
                  aria-describedby={
                    touched.email && errors.email ? 'contact-email-error' : undefined
                  }
                  className={cn(
                    'w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-[var(--text-primary)] backdrop-blur-sm transition-all placeholder:text-[var(--text-muted)] dark:bg-neutral-900/60',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    touched.email && errors.email
                      ? 'border-rose-500 focus-visible:ring-rose-500'
                      : touched.email && values.email.trim().length > 0
                        ? 'border-emerald-500/60 focus-visible:ring-emerald-500'
                        : 'border-[var(--border-light)] focus-visible:ring-blue-500',
                    isSubmitting && 'cursor-not-allowed opacity-60'
                  )}
                />
                {touched.email && errors.email && (
                  <AlertCircle className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-rose-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <p
                  id="contact-email-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-500"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message Textarea */}
            <div className="w-full">
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Message{' '}
                  <span className="text-rose-500" aria-hidden="true">
                    *
                  </span>
                </label>
                <span
                  id="contact-message-counter"
                  className={cn(
                    'text-xs transition-colors',
                    values.message.length > 5000
                      ? 'font-bold text-rose-500'
                      : values.message.length >= 4500
                        ? 'text-amber-500'
                        : 'text-[var(--text-muted)]'
                  )}
                >
                  {values.message.length} / 5000
                </span>
              </div>
              <div className="relative">
                <textarea
                  ref={messageInputRef}
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  disabled={isSubmitting}
                  placeholder="Tell me about your project, opportunity, or collaboration idea..."
                  value={values.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  aria-required="true"
                  aria-invalid={touched.message && !!errors.message ? 'true' : 'false'}
                  aria-describedby={
                    cn(
                      'contact-message-counter',
                      touched.message && errors.message && 'contact-message-error'
                    ) || undefined
                  }
                  className={cn(
                    'w-full resize-none rounded-xl border bg-white/70 px-4 py-3 text-sm text-[var(--text-primary)] backdrop-blur-sm transition-all placeholder:text-[var(--text-muted)] dark:bg-neutral-900/60',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    touched.message && errors.message
                      ? 'border-rose-500 focus-visible:ring-rose-500'
                      : touched.message && values.message.trim().length >= 10
                        ? 'border-emerald-500/60 focus-visible:ring-emerald-500'
                        : 'border-[var(--border-light)] focus-visible:ring-blue-500',
                    isSubmitting && 'cursor-not-allowed opacity-60'
                  )}
                />
              </div>
              {touched.message && errors.message && (
                <p
                  id="contact-message-error"
                  role="alert"
                  className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-500"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={isSubmitting || prefersReducedMotion ? undefined : { scale: 0.98 }}
              className={cn(
                'group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                isSubmitting && 'cursor-wait opacity-80'
              )}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Dispatching Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactForm;
