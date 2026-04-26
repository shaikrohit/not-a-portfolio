import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /**
       * DESIGN SYSTEM: COLOR PALETTE
       *
       * Philosophy: Restraint over expression.
       * We use a neutral palette with ONE accent color.
       * Colors should feel timeless — not trendy.
       */
      colors: {
        // Neutral palette - carefully selected for readability
        neutral: {
          50: '#FAFAFA', // Background light
          100: '#F5F5F5', // Surface light
          200: '#E5E5E5', // Border light
          300: '#D4D4D4', // Muted
          400: '#A3A3A3', // Placeholder
          500: '#737373', // Secondary text
          600: '#525252', // Primary text light mode
          700: '#404040', // Strong
          800: '#262626', // Background dark
          900: '#171717', // Surface dark
          950: '#0A0A0A', // Deep dark
        },
        // Single accent color - confident, not flashy
        accent: {
          DEFAULT: '#2563EB', // A refined blue - signals trust & intelligence
          light: '#3B82F6',
          dark: '#1D4ED8',
          muted: '#DBEAFE',
        },
        // Semantic colors
        surface: {
          light: '#FAFAFA',
          dark: '#0A0A0A',
        },
        text: {
          primary: {
            light: '#171717',
            dark: '#FAFAFA',
          },
          secondary: {
            light: '#525252',
            dark: '#A3A3A3',
          },
          muted: {
            light: '#737373',
            dark: '#737373',
          },
        },
      },
      /**
       * TYPOGRAPHY SYSTEM
       *
       * Font: Inter (humanist sans-serif) for body
       * Serif option: Playfair Display for elegant headings
       *
       * Philosophy: Typography should feel invisible when reading,
       * memorable when glancing.
       */
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Modular scale: 1.25 (major third)
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
        '5xl': ['3rem', { lineHeight: '1.15' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      /**
       * SPACING SYSTEM
       *
       * Based on 4px/8px grid.
       * Mathematical consistency creates visual harmony.
       */
      spacing: {
        '0': '0',
        '1': '0.25rem', // 4px
        '2': '0.5rem', // 8px
        '3': '0.75rem', // 12px
        '4': '1rem', // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem', // 24px
        '8': '2rem', // 32px
        '10': '2.5rem', // 40px
        '12': '3rem', // 48px
        '16': '4rem', // 64px
        '20': '5rem', // 80px
        '24': '6rem', // 96px
        '32': '8rem', // 128px
        '40': '10rem', // 160px
        '48': '12rem', // 192px
        '56': '14rem', // 224px
        '64': '16rem', // 256px
      },
      /**
       * ANIMATION SYSTEM
       *
       * Philosophy: Animation should feel like breathing.
       * Never jarring. Always purposeful.
       *
       * Timing: We use ease-out for entrances, ease-in for exits.
       * Duration: 200-400ms for micro-interactions, 500-800ms for transitions.
       */
      transitionDuration: {
        '0': '0ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-smooth': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-smooth': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      /**
       * LAYOUT
       */
      maxWidth: {
        prose: '65ch',
        content: '720px',
        wide: '1024px',
        full: '1280px',
      },
      /**
       * SHADOWS
       *
       * Minimal shadows. We prefer borders and spacing.
       */
      boxShadow: {
        subtle: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        soft: '0 2px 8px -2px rgb(0 0 0 / 0.08)',
        medium: '0 4px 16px -4px rgb(0 0 0 / 0.1)',
      },
      /**
       * KEYFRAME ANIMATIONS
       */
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-down': 'fade-down 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
