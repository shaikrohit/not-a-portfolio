'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { usePrefersReducedMotion, useMediaQuery } from '@/hooks';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  asChild?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  strength = 25,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Touch & accessibility guards
  const prefersReducedMotion = usePrefersReducedMotion();
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const isHoverNone = useMediaQuery('(hover: none)');
  const isMagneticDisabled = prefersReducedMotion || isCoarsePointer || isHoverNone;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (isMagneticDisabled) return;
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMagneticDisabled) return;
    const rect = rectRef.current || ref.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Apply distance factor
      const factor = strength / (rect.width / 2);
      setPosition({ x: dx * factor, y: dy * factor });
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={isMagneticDisabled ? { x: 0, y: 0 } : { x: position.x, y: position.y }}
      transition={
        isMagneticDisabled
          ? { duration: 0 }
          : { type: 'spring', stiffness: 200, damping: 18, mass: 0.1 }
      }
      onClick={onClick}
      className={`relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default MagneticButton;
