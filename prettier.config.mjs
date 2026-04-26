/**
 * Prettier Configuration
 * 
 * Formatting rules for consistent code style across the project.
 * Works in harmony with ESLint via eslint-config-prettier.
 * 
 * @see https://prettier.io/docs/en/options.html
 */

/** @type {import("prettier").Config} */
const config = {
  // Line length - balance readability with modern wide monitors
  printWidth: 100,

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Semicolons - explicit endings
  semi: true,

  // Quotes - single quotes for JS, double for JSX attributes
  singleQuote: true,
  jsxSingleQuote: false,

  // Trailing commas - ES5 compatible, helps with git diffs
  trailingComma: 'es5',

  // Brackets and spacing
  bracketSpacing: true,
  bracketSameLine: false,

  // Arrow functions - always use parens for consistency
  arrowParens: 'always',

  // Line endings - LF for cross-platform consistency
  endOfLine: 'lf',

  // Prose wrapping for markdown
  proseWrap: 'preserve',

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Single attribute per line in HTML/JSX
  singleAttributePerLine: false,

  // Plugins
  plugins: ['prettier-plugin-tailwindcss'],

  // Tailwind plugin configuration
  tailwindFunctions: ['clsx', 'cn', 'cva'],
};

export default config;
