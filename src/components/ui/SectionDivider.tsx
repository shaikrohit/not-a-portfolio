'use client';

import React, { useId } from 'react';

export type SectionDividerVariant = 'wave' | 'curve' | 'angle' | 'slant' | 'glow' | 'gradient';

export interface SectionDividerProps {
  /** Visual silhouette style */
  variant?: SectionDividerVariant;
  /** Invert vertically (upside down) */
  inverted?: boolean;
  /** Flip horizontally (mirror left-to-right) */
  flipX?: boolean;
  /** Color of the origin/top surface (CSS variable or color string) */
  fromColor?: string;
  /** Color of the target/filled surface (CSS variable or color string) */
  toColor?: string;
  /** Accent stroke color along the divider edge (optional) */
  strokeColor?: string;
  /** Stroke width in pixels (default: 1) */
  strokeWidth?: number;
  /** Whether to render a subtle luminous glow line along the contour */
  glow?: boolean;
  /** Custom glow color (default: rgba(59, 130, 246, 0.4)) */
  glowColor?: string;
  /** Height class or custom CSS height (default: responsive h-12 md:h-16 lg:h-20) */
  height?: string;
  /** Additional custom classes */
  className?: string;
  /** Unique ID prefix for SVG definitions to prevent collision */
  id?: string;
}

/**
 * SectionDivider Component
 *
 * Renders high-performance, responsive SVG and gradient dividers between major sections.
 * Supports wave, curve, angle, glow, and gradient variants with CSS variable theming
 * and zero horizontal layout shifts.
 */
export function SectionDivider({
  variant = 'wave',
  inverted = false,
  flipX = false,
  fromColor = 'transparent',
  toColor = 'var(--surface-elevated)',
  strokeColor,
  strokeWidth = 1,
  glow = false,
  glowColor = 'rgba(59, 130, 246, 0.4)',
  height = 'h-12 md:h-16 lg:h-20',
  className = '',
  id: customId,
}: SectionDividerProps) {
  const reactId = useId();
  const safeId = (customId || reactId).replace(/[:]/g, '');

  // Calculate CSS transform for inversion and horizontal flipping
  const scaleX = flipX ? -1 : 1;
  const scaleY = inverted ? -1 : 1;
  const transform = scaleX !== 1 || scaleY !== 1 ? `scale(${scaleX}, ${scaleY})` : undefined;

  // Variant: Glow / Light Beam Divider
  if (variant === 'glow') {
    return (
      <div
        role="presentation"
        aria-hidden="true"
        className={`pointer-events-none relative flex w-full select-none items-center justify-center overflow-hidden ${height} ${className}`}
        style={{ backgroundColor: fromColor !== 'transparent' ? fromColor : undefined }}
      >
        {/* Soft radial ambient glow */}
        <div
          className="absolute h-8 w-3/4 max-w-4xl rounded-full opacity-60 blur-md"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          }}
        />

        {/* Center crisp illuminated line */}
        <div
          className="mx-auto h-px w-full max-w-6xl"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${strokeColor || glowColor} 30%, ${strokeColor || glowColor} 70%, transparent 100%)`,
          }}
        />

        {/* Center optical light node */}
        <div
          className="absolute h-1.5 w-1.5 rounded-full shadow-sm"
          style={{
            backgroundColor: glowColor,
            boxShadow: `0 0 10px 2px ${glowColor}`,
          }}
        />
      </div>
    );
  }

  // Variant: Vertical Gradient Blend
  if (variant === 'gradient') {
    return (
      <div
        role="presentation"
        aria-hidden="true"
        className={`pointer-events-none relative w-full select-none overflow-hidden ${height} ${className}`}
        style={{
          background: `linear-gradient(${inverted ? 'to top' : 'to bottom'}, ${fromColor}, ${toColor})`,
        }}
      >
        {glow && (
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${glowColor} 50%, transparent 100%)`,
              boxShadow: `0 0 12px ${glowColor}`,
            }}
          />
        )}
      </div>
    );
  }

  // SVG Geometry Definitions
  const renderSvgContent = () => {
    switch (variant) {
      case 'curve':
        return (
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            preserveAspectRatio="none"
            className="block h-full w-full"
            style={{ transform, transformOrigin: 'center center' }}
          >
            <defs>
              {glow && (
                <filter id={`glow-curve-${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              )}
            </defs>

            {/* Filled Arc */}
            <path d="M 0,0 C 480,80 960,80 1440,0 L 1440,80 L 0,80 Z" style={{ fill: toColor }} />

            {/* Optional Contour Stroke & Glow */}
            {(strokeColor || glow) && (
              <path
                d="M 0,0 C 480,80 960,80 1440,0"
                fill="none"
                stroke={strokeColor || glowColor}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
                filter={glow ? `url(#glow-curve-${safeId})` : undefined}
                className="opacity-80"
              />
            )}
          </svg>
        );

      case 'angle':
      case 'slant':
        return (
          <svg
            viewBox="0 0 1440 64"
            fill="none"
            preserveAspectRatio="none"
            className="block h-full w-full"
            style={{ transform, transformOrigin: 'center center' }}
          >
            <defs>
              {glow && (
                <filter id={`glow-angle-${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              )}
            </defs>

            {/* Diagonal Polygon */}
            <path d="M 0,64 L 1440,0 L 1440,64 L 0,64 Z" style={{ fill: toColor }} />

            {/* Optional Contour Stroke & Glow */}
            {(strokeColor || glow) && (
              <path
                d="M 0,64 L 1440,0"
                fill="none"
                stroke={strokeColor || glowColor}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
                filter={glow ? `url(#glow-angle-${safeId})` : undefined}
                className="opacity-80"
              />
            )}
          </svg>
        );

      case 'wave':
      default:
        return (
          <svg
            viewBox="0 0 1440 96"
            fill="none"
            preserveAspectRatio="none"
            className="block h-full w-full"
            style={{ transform, transformOrigin: 'center center' }}
          >
            <defs>
              {glow && (
                <filter id={`glow-wave-${safeId}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              )}
            </defs>

            {/* Ambient Secondary Wave Layer for Visual Depth */}
            <path
              d="M 0,48 C 360,100 720,16 1080,72 C 1260,96 1380,56 1440,52 L 1440,96 L 0,96 Z"
              style={{ fill: toColor }}
              className="opacity-35"
            />

            {/* Primary Sharp Wave Layer */}
            <path
              d="M 0,36 C 320,92 580,12 860,56 C 1140,100 1320,24 1440,40 L 1440,96 L 0,96 Z"
              style={{ fill: toColor }}
            />

            {/* Optional Contour Stroke & Glow */}
            {(strokeColor || glow) && (
              <path
                d="M 0,36 C 320,92 580,12 860,56 C 1140,100 1320,24 1440,40"
                fill="none"
                stroke={strokeColor || glowColor}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
                filter={glow ? `url(#glow-wave-${safeId})` : undefined}
                className="opacity-80"
              />
            )}
          </svg>
        );
    }
  };

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`pointer-events-none relative -my-px w-full select-none overflow-hidden ${height} ${className}`}
      style={{ backgroundColor: fromColor !== 'transparent' ? fromColor : undefined }}
    >
      {renderSvgContent()}
    </div>
  );
}

export default SectionDivider;
