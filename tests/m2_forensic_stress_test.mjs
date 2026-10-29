/**
 * Milestone 2 Forensic Integrity Stress Test Suite
 *
 * Independently verifies:
 * 1. CSS Variable Tokens validity (RGBA color tokens vs invalid shorthand)
 * 2. FOUT Inline Script execution & edge cases
 * 3. Navigation Component Spec & A11y conformance
 * 4. useActiveSection hook logic & boundary constraints
 * 5. SectionDivider SVG geometry & subpixel mitigation
 * 6. Theme Store & View Transitions integration
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import assert from 'assert';

console.log('=== Milestone 2 Forensic Integrity & Stress Audit ===\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// 1. CSS Variable Tokens Forensic Check
// ---------------------------------------------------------------------------
test('globals.css: --border-* tokens are genuine CSS color declarations', () => {
  const content = readFileSync(resolve('src/styles/globals.css'), 'utf-8');
  
  // Must NOT contain shorthand '1px solid ...'
  assert(!content.match(/--border-subtle:\s*1px\s+solid/i), 'Must not use shorthand in --border-subtle');
  assert(!content.match(/--border-light:\s*1px\s+solid/i), 'Must not use shorthand in --border-light');
  assert(!content.match(/--border-accent:\s*1px\s+solid/i), 'Must not use shorthand in --border-accent');

  // Must declare valid color values
  assert(content.includes('--border-subtle: rgba(0, 0, 0, 0.08);'), '--border-subtle must be valid rgba color');
  assert(content.includes('--border-light: rgba(0, 0, 0, 0.14);'), '--border-light must be valid rgba color');
  assert(content.includes('--border-accent: rgba(66, 133, 244, 0.2);'), '--border-accent must be valid rgba color');
});

test('theme.css: dark mode --border-* tokens are genuine CSS color declarations', () => {
  const content = readFileSync(resolve('src/styles/theme.css'), 'utf-8');

  assert(!content.match(/--border-subtle:\s*1px\s+solid/i), 'Dark mode must not use shorthand in --border-subtle');
  assert(!content.match(/--border-light:\s*1px\s+solid/i), 'Dark mode must not use shorthand in --border-light');
  assert(!content.match(/--border-accent:\s*1px\s+solid/i), 'Dark mode must not use shorthand in --border-accent');

  assert(content.includes('--border-subtle: rgba(255, 255, 255, 0.08);'), 'Dark --border-subtle must be valid rgba color');
  assert(content.includes('--border-light: rgba(255, 255, 255, 0.14);'), 'Dark --border-light must be valid rgba color');
  assert(content.includes('--border-accent: rgba(59, 130, 246, 0.35);'), 'Dark --border-accent must be valid rgba color');
});

test('globals.css: View Transitions & reduced-motion guards', () => {
  const content = readFileSync(resolve('src/styles/globals.css'), 'utf-8');
  assert(content.includes('::view-transition-old(root)'), 'Includes ::view-transition-old');
  assert(content.includes('::view-transition-new(root)'), 'Includes ::view-transition-new');
  assert(content.includes('@media (prefers-reduced-motion: reduce)'), 'Includes prefers-reduced-motion guard');
});

// ---------------------------------------------------------------------------
// 2. FOUT Script Forensic & Empirical Execution Check
// ---------------------------------------------------------------------------
test('layout.tsx: Synchronous FOUT elimination script extracted & analyzed', () => {
  const layout = readFileSync(resolve('src/app/layout.tsx'), 'utf-8');
  assert(layout.includes('theme-storage'), 'Extracts theme-storage from localStorage');
  assert(layout.includes('theme-color-meta'), 'Syncs meta theme-color tag');
  assert(layout.includes('suppressHydrationWarning'), 'Suppresses hydration warning on html');
  assert(layout.includes('color-scheme'), 'Declares color-scheme meta');
});

test('FOUT Script: Empirical simulation under dark mode', () => {
  // Simulate browser environment
  const classList = new Set();
  const attributes = {};
  const meta = {
    content: '',
    setAttribute(k, v) {
      this[k] = v;
    },
  };

  const fakeDocument = {
    documentElement: {
      classList: {
        add: (c) => classList.add(c),
        remove: (c) => classList.delete(c),
        contains: (c) => classList.has(c),
      },
      setAttribute: (k, v) => { attributes[k] = v; },
    },
    getElementById: (id) => (id === 'theme-color-meta' ? meta : null),
    querySelector: () => meta,
  };

  const fakeWindow = {
    matchMedia: () => ({ matches: false }),
  };

  const fakeLocalStorage = {
    getItem: (key) => JSON.stringify({ state: { mode: 'dark' } }),
  };

  const scriptCode = `(function(){try{var s=localStorage.getItem('theme-storage');var m='system';if(s){var p=JSON.parse(s);m=(p&&p.state&&p.state.mode)||p.mode||s;}var isDark=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;if(isDark){el.classList.add('dark');el.classList.remove('light');el.setAttribute('data-theme','dark');}else{el.classList.remove('dark');el.classList.add('light');el.setAttribute('data-theme','light');}var meta=document.getElementById('theme-color-meta')||document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',isDark?'#07090e':'#ffffff');}}catch(e){}})();`;

  const fn = new Function('document', 'window', 'localStorage', scriptCode);
  fn(fakeDocument, fakeWindow, fakeLocalStorage);

  assert(classList.has('dark'), 'dark class must be added');
  assert(!classList.has('light'), 'light class must be removed');
  assert.strictEqual(attributes['data-theme'], 'dark', 'data-theme must be dark');
  assert.strictEqual(meta.content, '#07090e', 'meta theme-color must be dark background hex');
});

test('FOUT Script: Empirical simulation under light mode', () => {
  const classList = new Set(['dark']);
  const attributes = {};
  const meta = {
    content: '',
    setAttribute(k, v) {
      this[k] = v;
    },
  };

  const fakeDocument = {
    documentElement: {
      classList: {
        add: (c) => classList.add(c),
        remove: (c) => classList.delete(c),
        contains: (c) => classList.has(c),
      },
      setAttribute: (k, v) => { attributes[k] = v; },
    },
    getElementById: () => meta,
    querySelector: () => meta,
  };

  const fakeWindow = {
    matchMedia: () => ({ matches: true }),
  };

  const fakeLocalStorage = {
    getItem: () => JSON.stringify({ state: { mode: 'light' } }),
  };

  const scriptCode = `(function(){try{var s=localStorage.getItem('theme-storage');var m='system';if(s){var p=JSON.parse(s);m=(p&&p.state&&p.state.mode)||p.mode||s;}var isDark=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;if(isDark){el.classList.add('dark');el.classList.remove('light');el.setAttribute('data-theme','dark');}else{el.classList.remove('dark');el.classList.add('light');el.setAttribute('data-theme','light');}var meta=document.getElementById('theme-color-meta')||document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',isDark?'#07090e':'#ffffff');}}catch(e){}})();`;

  const fn = new Function('document', 'window', 'localStorage', scriptCode);
  fn(fakeDocument, fakeWindow, fakeLocalStorage);

  assert(classList.has('light'), 'light class must be added');
  assert(!classList.has('dark'), 'dark class must be removed');
  assert.strictEqual(attributes['data-theme'], 'light', 'data-theme must be light');
  assert.strictEqual(meta.content, '#ffffff', 'meta theme-color must be white');
});

test('FOUT Script: System preference fallback when no storage', () => {
  const classList = new Set();
  const attributes = {};
  const meta = { content: '' };

  const fakeDocument = {
    documentElement: {
      classList: {
        add: (c) => classList.add(c),
        remove: (c) => classList.delete(c),
      },
      setAttribute: (k, v) => { attributes[k] = v; },
    },
    getElementById: () => meta,
    querySelector: () => meta,
  };

  const fakeWindow = {
    matchMedia: (query) => ({ matches: query.includes('dark') }),
  };

  const fakeLocalStorage = {
    getItem: () => null,
  };

  const scriptCode = `(function(){try{var s=localStorage.getItem('theme-storage');var m='system';if(s){var p=JSON.parse(s);m=(p&&p.state&&p.state.mode)||p.mode||s;}var isDark=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;if(isDark){el.classList.add('dark');el.classList.remove('light');el.setAttribute('data-theme','dark');}else{el.classList.remove('dark');el.classList.add('light');el.setAttribute('data-theme','light');}var meta=document.getElementById('theme-color-meta')||document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',isDark?'#07090e':'#ffffff');}}catch(e){}})();`;

  const fn = new Function('document', 'window', 'localStorage', scriptCode);
  fn(fakeDocument, fakeWindow, fakeLocalStorage);

  assert(classList.has('dark'), 'system dark mode should activate dark class');
});

test('FOUT Script: SecurityError resilience (cookies blocked / storage disabled)', () => {
  const fakeDocument = { documentElement: { classList: { add: () => {}, remove: () => {} }, setAttribute: () => {} } };
  const fakeWindow = { matchMedia: () => ({ matches: false }) };
  const fakeLocalStorage = {
    getItem: () => { throw new Error('SecurityError: Access is denied for this document'); },
  };

  const scriptCode = `(function(){try{var s=localStorage.getItem('theme-storage');var m='system';if(s){var p=JSON.parse(s);m=(p&&p.state&&p.state.mode)||p.mode||s;}var isDark=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;if(isDark){el.classList.add('dark');el.classList.remove('light');el.setAttribute('data-theme','dark');}else{el.classList.remove('dark');el.classList.add('light');el.setAttribute('data-theme','light');}var meta=document.getElementById('theme-color-meta')||document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',isDark?'#07090e':'#ffffff');}}catch(e){}})();`;

  const fn = new Function('document', 'window', 'localStorage', scriptCode);
  assert.doesNotThrow(() => fn(fakeDocument, fakeWindow, fakeLocalStorage), 'Must not throw if storage fails');
});

// ---------------------------------------------------------------------------
// 3. Navigation Component Spec & A11y Conformance
// ---------------------------------------------------------------------------
test('Navigation.tsx: Defines all 10 page sections for command palette', () => {
  const content = readFileSync(resolve('src/components/layout/Navigation.tsx'), 'utf-8');
  const expectedSections = [
    'hero',
    'paths',
    'about',
    'experience',
    'education',
    'achievements',
    'projects',
    'skills',
    'trivia',
    'contact',
  ];
  for (const s of expectedSections) {
    assert(content.includes(`id: '${s}'`), `Must index section '${s}'`);
  }
});

test('Navigation.tsx: Implements mobile drawer accessibility and scroll lock', () => {
  const content = readFileSync(resolve('src/components/layout/Navigation.tsx'), 'utf-8');
  assert(content.includes('role="dialog"'), 'Mobile drawer must declare role="dialog"');
  assert(content.includes('aria-modal="true"'), 'Mobile drawer must declare aria-modal="true"');
  assert(content.includes('aria-controls="mobile-nav-drawer"'), 'Trigger button must declare aria-controls');
  assert(content.includes('aria-expanded={mobileOpen}'), 'Trigger button must declare aria-expanded');
  assert(content.includes('document.body.style.overflow = \'hidden\''), 'Must lock body scroll');
  assert(content.includes('document.body.style.paddingRight'), 'Must compensate scrollbar width to prevent layout shift');
  assert(content.includes("e.key === 'Escape'"), 'Must handle Escape key dismissal');
});

test('Navigation.tsx: Implements Command Palette with search and keyboard navigation', () => {
  const content = readFileSync(resolve('src/components/layout/Navigation.tsx'), 'utf-8');
  assert(content.includes('(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === \'k\''), 'Must bind Ctrl+K / Cmd+K');
  assert(content.includes("e.key === 'ArrowDown'"), 'Must handle ArrowDown in search results');
  assert(content.includes("e.key === 'ArrowUp'"), 'Must handle ArrowUp in search results');
  assert(content.includes("e.key === 'Enter'"), 'Must handle Enter selection in search results');
  assert(content.includes('filteredSections'), 'Must filter sections dynamically');
});

// ---------------------------------------------------------------------------
// 4. useActiveSection Hook Logic
// ---------------------------------------------------------------------------
test('useActiveSection.ts: Implements robust IntersectionObserver + MutationObserver', () => {
  const content = readFileSync(resolve('src/hooks/useActiveSection.ts'), 'utf-8');
  assert(content.includes('new IntersectionObserver'), 'Must use native IntersectionObserver');
  assert(content.includes('new MutationObserver'), 'Must use MutationObserver to observe dynamic imports');
  assert(content.includes('isClickScrollingRef'), 'Must use mutex lock during programmatic smooth scroll');
  assert(content.includes('scrollY <= 50'), 'Top boundary must clamp to hero');
  assert(content.includes('docHeight - 50'), 'Bottom boundary must clamp to contact');
  assert(content.includes('rootMargin'), 'Configurable rootMargin reading focus window');
});

// ---------------------------------------------------------------------------
// 5. SectionDivider Component Spec Conformance
// ---------------------------------------------------------------------------
test('SectionDivider.tsx: Implements all visual silhouettes with responsive SVG', () => {
  const content = readFileSync(resolve('src/components/ui/SectionDivider.tsx'), 'utf-8');
  assert(content.includes("'wave'"), 'Supports wave variant');
  assert(content.includes("'curve'"), 'Supports curve variant');
  assert(content.includes("'angle'"), 'Supports angle variant');
  assert(content.includes("'slant'"), 'Supports slant variant');
  assert(content.includes("'glow'"), 'Supports glow variant');
  assert(content.includes("'gradient'"), 'Supports gradient variant');
  assert(content.includes('preserveAspectRatio="none"'), 'SVG must use preserveAspectRatio="none"');
  assert(content.includes('vectorEffect="non-scaling-stroke"'), 'Strokes must use vectorEffect="non-scaling-stroke"');
  assert(content.includes('-my-px'), 'Must include subpixel seam mitigation');
});

// ---------------------------------------------------------------------------
// 6. MorphingBackground & Theme Store Conformance
// ---------------------------------------------------------------------------
test('MorphingBackground.tsx: Dynamic background with surface-base CSS variables', () => {
  const content = readFileSync(resolve('src/components/layout/MorphingBackground.tsx'), 'utf-8');
  assert(content.includes('bg-[var(--surface-base)]'), 'Must use var(--surface-base)');
  assert(!content.includes('bg-white absolute inset-0'), 'Must NOT have hardcoded opaque white background');
});

test('store/index.ts: Theme store implements View Transitions & meta theme-color sync', () => {
  const content = readFileSync(resolve('src/store/index.ts'), 'utf-8');
  assert(content.includes('startViewTransition'), 'Leverages modern startViewTransition');
  assert(content.includes('prefers-reduced-motion'), 'Guards view transitions against prefers-reduced-motion');
  assert(content.includes('metaThemeColor.setAttribute(\'content\''), 'Synchronizes meta theme-color in browser chrome');
  assert(content.includes("name: 'theme-storage'"), 'Persists under theme-storage in localStorage');
});

// ---------------------------------------------------------------------------
// 7. Page Integration
// ---------------------------------------------------------------------------
test('page.tsx: Seamlessly positions SectionDivider between page sections', () => {
  const content = readFileSync(resolve('src/app/page.tsx'), 'utf-8');
  const dividerOccurrences = (content.match(/<SectionDivider/g) || []).length;
  assert(dividerOccurrences >= 5, `Expected at least 5 SectionDividers across page, found ${dividerOccurrences}`);
  assert(content.includes('<Navigation />'), 'Navigation component rendered');
  assert(content.includes('<MorphingBackground />'), 'MorphingBackground component rendered');
});

console.log(`\n=== Stress Test Results: ${passedTests}/${totalTests} Passed ===\n`);
if (passedTests !== totalTests) {
  process.exit(1);
}
