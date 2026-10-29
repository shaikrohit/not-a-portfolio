'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion, useMediaQuery } from '@/hooks';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  onClick,
  'aria-label': ariaLabel,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  // Touch & accessibility guards
  const prefersReducedMotion = usePrefersReducedMotion();
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const isHoverNone = useMediaQuery('(hover: none)');
  const isInteractiveTiltDisabled = prefersReducedMotion || isCoarsePointer || isHoverNone;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (isInteractiveTiltDisabled) return;
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isInteractiveTiltDisabled) return;
    const rect = rectRef.current || cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTilt({ x: rotateX, y: rotateY });

      if (glare) {
        setGlarePos({
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          opacity: 0.15,
        });
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rectRef.current = null;

    if (isInteractiveTiltDisabled) return;
    setTilt({ x: 0, y: 0 });
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      style={{ perspective: isInteractiveTiltDisabled ? undefined : '1200px' }}
      className="h-full w-full"
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
    >
      <motion.div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={
          isInteractiveTiltDisabled
            ? { rotateX: 0, rotateY: 0 }
            : { rotateX: tilt.x, rotateY: tilt.y }
        }
        transition={
          isInteractiveTiltDisabled
            ? { duration: 0 }
            : { type: 'spring', stiffness: 260, damping: 20 }
        }
        style={{ transformStyle: isInteractiveTiltDisabled ? undefined : 'preserve-3d' }}
        className={`relative h-full w-full overflow-hidden ${className}`}
      >
        {children}

        {/* Dynamic Glare Reflection (disabled on touch & reduced motion) */}
        {glare && !isInteractiveTiltDisabled && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

export default TiltCard;
