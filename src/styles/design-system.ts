/**
 * ============================================================================
 * DESIGN SYSTEM - BLUE & BLACK THEME
 * ============================================================================
 *
 * A premium, enterprise-grade design system using only blue and black shades.
 * Every color, spacing, and animation is carefully crafted for elegance.
 *
 * Philosophy: Minimal, classic, and visually refined.
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary Black Shades - Deep, sophisticated
  black: {
    pure: '#000000',
    deep: '#050508',
    rich: '#0a0a0f',
    soft: '#121218',
    muted: '#1a1a24',
    light: '#24242e',
  },

  // Blue Shades - Trust, intelligence, premium feel
  blue: {
    pure: '#0066FF',
    bright: '#3388FF',
    vivid: '#1a75ff',
    deep: '#0052cc',
    dark: '#003d99',
    midnight: '#002266',

    // Subtle variations for gradients and accents
    glow: 'rgba(0, 102, 255, 0.15)',
    shimmer: 'rgba(51, 136, 255, 0.08)',
    border: 'rgba(0, 102, 255, 0.3)',
  },

  // Text Colors
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    accent: '#3388FF',
  },

  // Surface Colors
  surface: {
    base: '#050508',
    elevated: '#0a0a0f',
    overlay: '#121218',
    card: 'rgba(18, 18, 24, 0.8)',
    glass: 'rgba(10, 10, 15, 0.85)',
  },

  // State Colors
  state: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3388FF',
  },
} as const;

// ============================================================================
// PATH-SPECIFIC THEMES
// ============================================================================

export const pathThemes = {
  developer: {
    primary: '#0066FF',
    accent: '#00ccff',
    gradient: 'linear-gradient(135deg, #0066FF 0%, #00ccff 100%)',
    glow: '0 0 60px rgba(0, 102, 255, 0.3)',
    icon: '💻',
    pattern: 'circuit',
  },
  recruiter: {
    primary: '#0052cc',
    accent: '#6699ff',
    gradient: 'linear-gradient(135deg, #0052cc 0%, #6699ff 100%)',
    glow: '0 0 60px rgba(0, 82, 204, 0.3)',
    icon: '📋',
    pattern: 'grid',
  },
  student: {
    primary: '#3388FF',
    accent: '#66bbff',
    gradient: 'linear-gradient(135deg, #3388FF 0%, #66bbff 100%)',
    glow: '0 0 60px rgba(51, 136, 255, 0.3)',
    icon: '📚',
    pattern: 'dots',
  },
  explorer: {
    primary: '#1a75ff',
    accent: '#99ccff',
    gradient: 'linear-gradient(135deg, #1a75ff 0%, #99ccff 100%)',
    glow: '0 0 60px rgba(26, 117, 255, 0.3)',
    icon: '🔍',
    pattern: 'wave',
  },
} as const;

// ============================================================================
// SPACING SYSTEM (8px grid)
// ============================================================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    sans: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
    '5xl': '3rem',
    '6xl': '4rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// ============================================================================
// SHADOWS & EFFECTS
// ============================================================================

export const effects = {
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
    glow: '0 0 40px rgba(0, 102, 255, 0.2)',
    glowStrong: '0 0 60px rgba(0, 102, 255, 0.4)',
  },
  blur: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
  },
  border: {
    subtle: '1px solid rgba(255, 255, 255, 0.05)',
    light: '1px solid rgba(255, 255, 255, 0.1)',
    accent: '1px solid rgba(0, 102, 255, 0.3)',
    accentStrong: '2px solid rgba(0, 102, 255, 0.5)',
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const components = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '56px',
    },
    borderRadius: '8px',
  },
  input: {
    height: '48px',
    borderRadius: '8px',
  },
  card: {
    borderRadius: '12px',
    padding: '24px',
  },
  modal: {
    borderRadius: '16px',
    maxWidth: '560px',
  },
} as const;

export type PathType = keyof typeof pathThemes;
export type ColorShade = typeof colors;
