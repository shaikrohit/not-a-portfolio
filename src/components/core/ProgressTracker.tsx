'use client';

/**
 * ============================================================================
 * PROGRESS TRACKER
 * ============================================================================
 * 
 * Visual progress indicator with step-by-step navigation.
 * Enforces forward-only navigation pattern.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressTrackerProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

// ============================================================================
// STEP COMPONENT
// ============================================================================

interface StepIndicatorProps {
  step: Step;
  index: number;
  currentStep: number;
  totalSteps: number;
  variant: 'horizontal' | 'vertical';
}

const StepIndicator = memo(function StepIndicator({
  step,
  index,
  currentStep,
  totalSteps,
  variant,
}: StepIndicatorProps) {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;
  const _isPending = index > currentStep;

  return (
    <div className={`
      flex items-center
      ${variant === 'horizontal' ? 'flex-col' : 'flex-row gap-4'}
      ${variant === 'horizontal' && index < totalSteps - 1 ? 'flex-1' : ''}
    `}>
      {/* Step Circle + Line Container */}
      <div className={`
        flex items-center
        ${variant === 'horizontal' ? 'w-full' : 'flex-col'}
      `}>
        {/* Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className={`
            relative z-10 flex items-center justify-center
            w-10 h-10 rounded-full
            font-semibold text-sm
            transition-all duration-500
            ${isCompleted 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
              : isCurrent 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 animate-pulse-ring' 
                : 'bg-[var(--surface-overlay)] text-white/30 border-2 border-white/10'
            }
          `}
        >
          {isCompleted ? (
            <Check className="w-5 h-5" />
          ) : (
            <span>{index + 1}</span>
          )}
        </motion.div>

        {/* Connecting Line */}
        {index < totalSteps - 1 && (
          <div className={`
            ${variant === 'horizontal' 
              ? 'flex-1 h-0.5 mx-2' 
              : 'w-0.5 h-12 my-2'
            }
            bg-white/10 overflow-hidden
          `}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isCompleted ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`
                h-full origin-left
                bg-gradient-to-r from-blue-500 to-blue-400
              `}
              style={{ 
                transformOrigin: variant === 'horizontal' ? 'left' : 'top' 
              }}
            />
          </div>
        )}
      </div>

      {/* Label */}
      <div className={`
        ${variant === 'horizontal' ? 'mt-3 text-center' : ''}
      `}>
        <p className={`
          text-sm font-medium transition-colors duration-300
          ${isCurrent 
            ? 'text-white' 
            : isCompleted 
              ? 'text-blue-300' 
              : 'text-white/30'
          }
        `}>
          {step.label}
        </p>
        {step.description && variant === 'vertical' && (
          <p className={`
            text-xs mt-1 transition-colors duration-300
            ${isCurrent ? 'text-white/60' : 'text-white/20'}
          `}>
            {step.description}
          </p>
        )}
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ProgressTracker = memo(function ProgressTracker({
  steps,
  currentStep,
  className = '',
  variant = 'horizontal',
}: ProgressTrackerProps) {
  return (
    <div className={`
      ${variant === 'horizontal' 
        ? 'flex items-start justify-between w-full' 
        : 'flex flex-col'
      }
      ${className}
    `}>
      {steps.map((step, index) => (
        <StepIndicator
          key={step.id}
          step={step}
          index={index}
          currentStep={currentStep}
          totalSteps={steps.length}
          variant={variant}
        />
      ))}
    </div>
  );
});

// ============================================================================
// MINI PROGRESS (for header)
// ============================================================================

interface MiniProgressProps {
  current: number;
  total: number;
  label?: string;
}

export const MiniProgress = memo(function MiniProgress({
  current,
  total,
  label,
}: MiniProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm text-white/50">{label}</span>
      )}
      
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
          />
        </div>
        
        <span className="text-sm font-medium text-white/70">
          {current}/{total}
        </span>
      </div>
    </div>
  );
});

export default ProgressTracker;
