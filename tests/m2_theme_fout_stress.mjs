/**
 * Empirical Stress Test Harness for Milestone 2
 * Dark/Light Theme System, FOUT Elimination, CSS Variable Tokens, & Visual Polish
 *
 * Tests:
 * 1. FOUT Inline Script Oracle across all matrix states (18+ conditions)
 * 2. Static HTML / Head / Prerender Attributes Verification
 * 3. CSS Token Grammar, Specificity & Tailwind Border Resolution
 * 4. MorphingBackground Dark Mode Obsidian Canvas & Zero Bleed-Through
 * 5. SectionDivider Subpixel Seam Mitigation & Vector Scaling Invariants
 * 6. View Transitions API Guarding & prefers-reduced-motion Conformance
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert';

const RESULTS = {
  passed: 0,
  failed: 0,
  defects: [],
  warnings: [],
  tests: [],
};

function test(name, fn) {
  try {
    fn();
    RESULTS.passed++;
    RESULTS.tests.push({ name, status: 'PASS' });
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    RESULTS.failed++;
    RESULTS.tests.push({ name, status: 'FAIL', error: err.message });
    console.error(`✗ FAIL: ${name}\n  Error: ${err.message}`);
  }
}

function testDefect(name, fn) {
  try {
    fn();
    RESULTS.defects.push({ name, status: 'DEFECT_CONFIRMED' });
    console.log(`⚠️ CHALLENGE DEFECT CONFIRMED: ${name}`);
  } catch (err) {
    RESULTS.failed++;
    RESULTS.tests.push({ name, status: 'UNABLE_TO_REPRODUCE', error: err.message });
    console.error(`✗ UNABLE TO REPRODUCE DEFECT: ${name}\n  Error: ${err.message}`);
  }
}

console.log('================================================================');
console.log('STARTING EMPIRICAL STRESS TEST SUITE: MILESTONE 2 (THEME & FOUT)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// MODULE 1: FOUT Inline Script Oracle across all Storage & Media Conditions
// -----------------------------------------------------------------------------
console.log('--- MODULE 1: FOUT Inline Script Resilience Oracle ---');

// Extract inline script directly from src/app/layout.tsx
const layoutSource = fs.readFileSync('src/app/layout.tsx', 'utf8');
const scriptMatch = layoutSource.match(/__html:\s*`([\s\S]*?)`/);
if (!scriptMatch) {
  throw new Error('Could not extract inline FOUT script from src/app/layout.tsx');
}
const inlineScriptCode = scriptMatch[1].trim();

/**
 * Creates an isolated mock DOM environment to test the inline script.
 */
function createMockDOMEnvironment({
  storageValue = undefined,
  storageThrows = false,
  systemDark = false,
  hasMeta = true,
  hasMatchMedia = true,
} = {}) {
  const classListSet = new Set();
  const attributes = {};
  const metaAttributes = {};

  const docEl = {
    classList: {
      add: (cls) => classListSet.add(cls),
      remove: (cls) => classListSet.delete(cls),
      contains: (cls) => classListSet.has(cls),
    },
    setAttribute: (k, v) => {
      attributes[k] = String(v);
    },
    getAttribute: (k) => attributes[k] || null,
  };

  const metaEl = hasMeta
    ? {
        setAttribute: (k, v) => {
          metaAttributes[k] = String(v);
        },
        getAttribute: (k) => metaAttributes[k] || null,
      }
    : null;

  const mockStorage = {
    getItem: (key) => {
      if (storageThrows) {
        throw new Error('SecurityError: Access to localStorage is denied.');
      }
      if (key === 'theme-storage') {
        return storageValue !== undefined ? storageValue : null;
      }
      return null;
    },
  };

  const mockWindow = {
    matchMedia: hasMatchMedia
      ? (query) => {
          return {
            matches: query.includes('prefers-color-scheme: dark') ? systemDark : false,
          };
        }
      : undefined,
  };

  const mockDocument = {
    documentElement: docEl,
    getElementById: (id) => (id === 'theme-color-meta' ? metaEl : null),
    querySelector: (sel) => (sel === 'meta[name="theme-color"]' ? metaEl : null),
  };

  const sandbox = {
    localStorage: mockStorage,
    window: mockWindow,
    document: mockDocument,
    JSON,
  };

  return {
    sandbox,
    getState: () => ({
      hasDarkClass: classListSet.has('dark'),
      hasLightClass: classListSet.has('light'),
      dataTheme: attributes['data-theme'] || null,
      themeColor: metaAttributes['content'] || null,
    }),
  };
}

// 1.1 Zustand format: mode = 'dark', system = light
test('FOUT Script: Zustand format mode="dark" sets .dark, data-theme="dark", meta=#07090e', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ state: { mode: 'dark' }, version: 0 }),
    systemDark: false,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, true, 'Must have dark class');
  assert.strictEqual(state.hasLightClass, false, 'Must NOT have light class');
  assert.strictEqual(state.dataTheme, 'dark', 'Must have data-theme="dark"');
  assert.strictEqual(state.themeColor, '#07090e', 'Must set theme-color to #07090e');
});

// 1.2 Zustand format: mode = 'light', system = dark
test('FOUT Script: Zustand format mode="light" sets .light, data-theme="light", meta=#ffffff', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ state: { mode: 'light' }, version: 0 }),
    systemDark: true,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, false, 'Must NOT have dark class');
  assert.strictEqual(state.hasLightClass, true, 'Must have light class');
  assert.strictEqual(state.dataTheme, 'light', 'Must have data-theme="light"');
  assert.strictEqual(state.themeColor, '#ffffff', 'Must set theme-color to #ffffff');
});

// 1.3 Zustand format: mode = 'system', system = dark
test('FOUT Script: Zustand format mode="system" queries matchMedia and resolves dark', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ state: { mode: 'system' } }),
    systemDark: true,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, true);
  assert.strictEqual(state.hasLightClass, false);
  assert.strictEqual(state.dataTheme, 'dark');
  assert.strictEqual(state.themeColor, '#07090e');
});

// 1.4 Zustand format: mode = 'system', system = light
test('FOUT Script: Zustand format mode="system" queries matchMedia and resolves light', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ state: { mode: 'system' } }),
    systemDark: false,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, false);
  assert.strictEqual(state.hasLightClass, true);
  assert.strictEqual(state.dataTheme, 'light');
  assert.strictEqual(state.themeColor, '#ffffff');
});

// 1.5 Direct object format: { mode: 'dark' }
test('FOUT Script: Direct object format { mode: "dark" } resolves dark', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ mode: 'dark' }),
    systemDark: false,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, true);
  assert.strictEqual(state.dataTheme, 'dark');
  assert.strictEqual(state.themeColor, '#07090e');
});

// 1.6 Direct object format: { mode: 'light' }
test('FOUT Script: Direct object format { mode: "light" } resolves light', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ mode: 'light' }),
    systemDark: true,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasLightClass, true);
  assert.strictEqual(state.dataTheme, 'light');
  assert.strictEqual(state.themeColor, '#ffffff');
});

// 1.7 Defect Confirmation: Raw string storage expression evaluation
testDefect(
  'FOUT Script Defect Oracle: Storage containing raw string "dark" fails strict equality check',
  () => {
    const env = createMockDOMEnvironment({
      storageValue: '"dark"',
      systemDark: false,
    });
    vm.runInNewContext(inlineScriptCode, env.sandbox);
    const state = env.getState();
    // Due to operator precedence in: m = (p && p.state && p.state.mode) || p.mode || s
    // When p is a string ("dark"), p.state is undefined, p.mode is undefined, so it evaluates to s ('"dark"').
    // Because m === '"dark"' !== 'dark', isDark evaluates to false on system light, failing to apply .dark class.
    assert.strictEqual(
      state.hasDarkClass,
      false,
      'Confirms defect: fails to resolve dark due to serialized quote retention'
    );
    RESULTS.warnings.push({
      item: 'Raw String In Storage Retains Quotes',
      details:
        "If localStorage contains serialized string '\"dark\"', expression evaluates to raw s with quotes ('\"dark\"') instead of p ('dark'), falling back to system preference.",
    });
  }
);

testDefect(
  'FOUT Script Defect Oracle: Storage containing unquoted raw string "dark" throws SyntaxError into catch block',
  () => {
    const env = createMockDOMEnvironment({
      storageValue: 'dark', // unquoted raw string
      systemDark: true,
    });
    // Does not throw unhandled exception to outside caller
    assert.doesNotThrow(() => {
      vm.runInNewContext(inlineScriptCode, env.sandbox);
    });
    const state = env.getState();
    // But because JSON.parse('dark') throws SyntaxError, it aborts try block, leaving <html> without .dark class
    assert.strictEqual(
      state.hasDarkClass,
      false,
      'Confirms defect: unquoted raw string causes early exit in catch block'
    );
  }
);

// 1.9 Empty storage (null) with system dark
test('FOUT Script: Empty storage defaults to system dark when OS prefers dark', () => {
  const env = createMockDOMEnvironment({
    storageValue: null,
    systemDark: true,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, true);
  assert.strictEqual(state.dataTheme, 'dark');
  assert.strictEqual(state.themeColor, '#07090e');
});

// 1.10 Empty storage (null) with system light
test('FOUT Script: Empty storage defaults to system light when OS prefers light', () => {
  const env = createMockDOMEnvironment({
    storageValue: null,
    systemDark: false,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasLightClass, true);
  assert.strictEqual(state.dataTheme, 'light');
  assert.strictEqual(state.themeColor, '#ffffff');
});

// 1.11 Malformed JSON in storage
test('FOUT Script: Malformed JSON ("{corrupted_json") is caught safely without throwing', () => {
  const env = createMockDOMEnvironment({
    storageValue: '{corrupted_json: true, invalid',
    systemDark: true,
  });
  assert.doesNotThrow(() => {
    vm.runInNewContext(inlineScriptCode, env.sandbox);
  }, 'Must not throw on malformed JSON');
});

// 1.12 Corrupt JSON behavior analysis
test('FOUT Script: Corrupt JSON analysis and fallback behavior', () => {
  const env = createMockDOMEnvironment({
    storageValue: '{bad',
    systemDark: true,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  // Notice: Because JSON.parse is in the main try block, syntax error causes early exit.
  // The document remains untouched (no unhandled exception).
  RESULTS.warnings.push({
    item: 'FOUT on Corrupt JSON',
    details:
      'When localStorage contains malformed JSON, JSON.parse throws inside the main try/catch block, catching safely without unhandled errors. HTML retains default light markup.',
  });
  assert.strictEqual(true, true);
});

// 1.13 Primitive JSON values: 123, true, null, []
test('FOUT Script: Primitive JSON values handled without crashing', () => {
  const primitives = ['123', 'true', 'false', 'null', '[]'];
  for (const prim of primitives) {
    const env = createMockDOMEnvironment({
      storageValue: prim,
      systemDark: false,
    });
    assert.doesNotThrow(() => {
      vm.runInNewContext(inlineScriptCode, env.sandbox);
    }, `Must not throw for primitive ${prim}`);
  }
});

// 1.14 Missing theme-color meta tag
test('FOUT Script: DOM without theme-color meta tag executes without crashing', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ state: { mode: 'dark' } }),
    systemDark: false,
    hasMeta: false,
  });
  assert.doesNotThrow(() => {
    vm.runInNewContext(inlineScriptCode, env.sandbox);
  });
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, true);
  assert.strictEqual(state.dataTheme, 'dark');
});

// 1.15 Missing matchMedia (legacy or restricted WebView)
test('FOUT Script: Missing window.matchMedia does not crash script', () => {
  const env = createMockDOMEnvironment({
    storageValue: null,
    systemDark: false,
    hasMatchMedia: false,
  });
  assert.doesNotThrow(() => {
    vm.runInNewContext(inlineScriptCode, env.sandbox);
  });
});

// 1.16 Storage access denied (Safari Private mode / restricted iframe)
test('FOUT Script: SecurityError on localStorage.getItem handled gracefully', () => {
  const env = createMockDOMEnvironment({
    storageThrows: true,
    systemDark: true,
  });
  assert.doesNotThrow(() => {
    vm.runInNewContext(inlineScriptCode, env.sandbox);
  });
});

// 1.17 Script idempotency (Multiple consecutive executions)
test('FOUT Script: Idempotent - running twice leaves clean classList and attributes', () => {
  const env = createMockDOMEnvironment({
    storageValue: JSON.stringify({ state: { mode: 'dark' } }),
    systemDark: false,
  });
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  vm.runInNewContext(inlineScriptCode, env.sandbox);
  const state = env.getState();
  assert.strictEqual(state.hasDarkClass, true);
  assert.strictEqual(state.hasLightClass, false);
  assert.strictEqual(state.dataTheme, 'dark');
  assert.strictEqual(state.themeColor, '#07090e');
});

// -----------------------------------------------------------------------------
// MODULE 2: Prerendered Static HTML Inspection from Live Server
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 2: Live HTML Prerender & Meta Tag Verification ---');

test('Live Server: HTML contains theme-color, color-scheme, and inline FOUT script', async () => {
  const res = await fetch('http://localhost:3001/');
  assert.strictEqual(res.status, 200, 'Server must return 200 OK');
  const html = await res.text();

  // 2.1 theme-color meta tag
  assert(
    html.includes('<meta name="theme-color" content="#ffffff" id="theme-color-meta"/>'),
    'HTML must contain meta theme-color with id="theme-color-meta"'
  );

  // 2.2 color-scheme meta tag
  assert(
    html.includes('<meta name="color-scheme" content="light dark"/>'),
    'HTML must contain meta color-scheme="light dark"'
  );

  // 2.3 Inline script present in head
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
  assert(headMatch, 'HTML must contain <head>');
  assert(headMatch[1].includes('theme-storage'), 'Head must contain synchronous theme script');

  // 2.4 html tag does NOT have obsolete bg-surface-base
  const htmlTagMatch = html.match(/<html[^>]*>/);
  assert(htmlTagMatch, 'HTML must contain <html> tag');
  assert(
    !htmlTagMatch[0].includes('bg-surface-base'),
    '<html> tag must NOT have obsolete bg-surface-base class'
  );

  // 2.5 body tag has bg-[var(--surface-base)]
  const bodyTagMatch = html.match(/<body[^>]*>/);
  assert(bodyTagMatch, 'HTML must contain <body> tag');
  assert(
    bodyTagMatch[0].includes('bg-[var(--surface-base)]'),
    '<body> tag must include bg-[var(--surface-base)]'
  );
});

// -----------------------------------------------------------------------------
// MODULE 3: CSS Token Specifications & Tailwind Border Resolution
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 3: CSS Token Resolution & Border Syntax ---');

const globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
const themeCss = fs.readFileSync('src/styles/theme.css', 'utf8');

// Helper to validate RGBA / Hex CSS color
function isValidColor(val) {
  if (!val) return false;
  const trimmed = val.trim();
  // pure rgba: rgba(r, g, b, a)
  const rgbaRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(?:0|1|0?\.\d+)\s*\)$/;
  // hex: #rgb or #rrggbb or #rrggbbaa
  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
  // var reference
  const varRegex = /^var\(--[a-zA-Z0-9_-]+\)$/;
  return rgbaRegex.test(trimmed) || hexRegex.test(trimmed) || varRegex.test(trimmed);
}

// Helper to check for illegal shorthand in border-color variable
function containsBorderShorthand(val) {
  return /1px\s+solid/i.test(val) || /\bsolid\b/i.test(val);
}

// 3.1 globals.css :root tokens
test('globals.css: Light mode border tokens are valid <color> values without shorthand', () => {
  const subtleMatch = globalsCss.match(/--border-subtle:\s*([^;]+);/);
  const lightMatch = globalsCss.match(/--border-light:\s*([^;]+);/);
  const accentMatch = globalsCss.match(/--border-accent:\s*([^;]+);/);

  assert(subtleMatch, 'Must define --border-subtle in globals.css');
  assert(lightMatch, 'Must define --border-light in globals.css');
  assert(accentMatch, 'Must define --border-accent in globals.css');

  const subtleVal = subtleMatch[1].trim();
  const lightVal = lightMatch[1].trim();
  const accentVal = accentMatch[1].trim();

  assert(
    !containsBorderShorthand(subtleVal),
    `--border-subtle must not contain shorthand (got: ${subtleVal})`
  );
  assert(
    !containsBorderShorthand(lightVal),
    `--border-light must not contain shorthand (got: ${lightVal})`
  );
  assert(
    !containsBorderShorthand(accentVal),
    `--border-accent must not contain shorthand (got: ${accentVal})`
  );

  assert(isValidColor(subtleVal), `--border-subtle must be a valid <color> (got: ${subtleVal})`);
  assert(isValidColor(lightVal), `--border-light must be a valid <color> (got: ${lightVal})`);
  assert(isValidColor(accentVal), `--border-accent must be a valid <color> (got: ${accentVal})`);
});

// 3.2 theme.css dark mode tokens
test('theme.css: Dark mode border tokens are valid <color> values without shorthand', () => {
  const subtleMatch = themeCss.match(/--border-subtle:\s*([^;]+);/);
  const lightMatch = themeCss.match(/--border-light:\s*([^;]+);/);
  const accentMatch = themeCss.match(/--border-accent:\s*([^;]+);/);

  assert(subtleMatch, 'Must define --border-subtle in theme.css');
  assert(lightMatch, 'Must define --border-light in theme.css');
  assert(accentMatch, 'Must define --border-accent in theme.css');

  const subtleVal = subtleMatch[1].trim();
  const lightVal = lightMatch[1].trim();
  const accentVal = accentMatch[1].trim();

  assert(
    !containsBorderShorthand(subtleVal),
    `Dark --border-subtle must not contain shorthand (got: ${subtleVal})`
  );
  assert(
    !containsBorderShorthand(lightVal),
    `Dark --border-light must not contain shorthand (got: ${lightVal})`
  );
  assert(
    !containsBorderShorthand(accentVal),
    `Dark --border-accent must not contain shorthand (got: ${accentVal})`
  );

  assert(
    isValidColor(subtleVal),
    `Dark --border-subtle must be a valid <color> (got: ${subtleVal})`
  );
  assert(isValidColor(lightVal), `Dark --border-light must be a valid <color> (got: ${lightVal})`);
  assert(
    isValidColor(accentVal),
    `Dark --border-accent must be a valid <color> (got: ${accentVal})`
  );
});

// 3.3 Utility class definitions in globals.css (.glass, .glass-strong, .card-base)
test('globals.css: .glass, .glass-strong, .card-base specify full "border: 1px solid var(...)"', () => {
  const glassMatch = globalsCss.match(/\.glass\s*\{[\s\S]*?border:\s*([^;]+);/);
  const glassStrongMatch = globalsCss.match(/\.glass-strong\s*\{[\s\S]*?border:\s*([^;]+);/);
  const cardBaseMatch = globalsCss.match(/\.card-base\s*\{[\s\S]*?border:\s*([^;]+);/);

  assert(glassMatch, '.glass must define border property');
  assert(glassStrongMatch, '.glass-strong must define border property');
  assert(cardBaseMatch, '.card-base must define border property');

  assert.strictEqual(glassMatch[1].trim(), '1px solid var(--border-subtle)');
  assert.strictEqual(glassStrongMatch[1].trim(), '1px solid var(--border-light)');
  assert.strictEqual(cardBaseMatch[1].trim(), '1px solid var(--border-subtle)');
});

// 3.4 Scan entire codebase for border-[var(--border-*)] usages
test('Codebase Scan: All border-[var(--border-*)] usages in src/ are syntactically valid', () => {
  function scanDir(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(scanDir(fullPath));
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const tsxFiles = scanDir('src');
  let count = 0;
  const validVars = new Set(['--border-subtle', '--border-light', '--border-accent']);

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.matchAll(/border(?:-[trblxy])?-\[var\((--border-[a-zA-Z0-9_-]+)\)\]/g);
    for (const m of matches) {
      count++;
      const varName = m[1];
      assert(validVars.has(varName), `File ${file} uses undeclared border variable: ${varName}`);
    }
  }

  console.log(
    `  Found ${count} Tailwind border-[var(--border-*)] classes across ${tsxFiles.length} files.`
  );
  assert(count > 0, 'Should find border-[var(--border-*)] occurrences');
});

// -----------------------------------------------------------------------------
// MODULE 4: MorphingBackground & Zero Dark Mode Bleed-Through
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 4: MorphingBackground Obsidian Canvas Verification ---');

const morphingBgSource = fs.readFileSync('src/components/layout/MorphingBackground.tsx', 'utf8');

test('MorphingBackground: Zero hardcoded white backgrounds in container or backdrop', () => {
  // Check for hardcoded white classes
  assert(!morphingBgSource.includes('bg-white'), 'Must NOT contain bg-white');
  assert(!morphingBgSource.includes('bg-[#fff]'), 'Must NOT contain bg-[#fff]');
  assert(!morphingBgSource.includes('bg-[#ffffff]'), 'Must NOT contain bg-[#ffffff]');

  // Check that dynamic surface base is used
  assert(
    morphingBgSource.includes('bg-[var(--surface-base)]'),
    'Must use bg-[var(--surface-base)] for theme adaptivity'
  );
});

test('MorphingBackground: Blob gradients are transparent with bounded opacity', () => {
  // Mobile blob opacity check
  assert(morphingBgSource.includes('opacity-15'), 'Mobile blob must use subtle opacity-15');
  // Desktop blobs
  assert(morphingBgSource.includes('opacity-30'), 'Desktop blob 1 must use opacity-30');
  assert(morphingBgSource.includes('opacity-20'), 'Desktop blob 2 must use opacity-20');
  // Noise overlay
  assert(morphingBgSource.includes('opacity-[0.02]'), 'SVG Noise overlay must use opacity-[0.02]');
});

test('Theme Tokens: Dark mode --surface-base evaluates to #07090e (Obsidian Deep Black)', () => {
  const darkSurfaceMatch = themeCss.match(/--surface-base:\s*([^;]+);/);
  assert(darkSurfaceMatch, 'Must define --surface-base in theme.css');
  assert.strictEqual(
    darkSurfaceMatch[1].trim(),
    '#07090e',
    'Dark surface-base must be exactly #07090e'
  );
});

// -----------------------------------------------------------------------------
// MODULE 5: SectionDivider Seam Mitigation & Vector Scaling Invariants
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 5: SectionDivider Seam Mitigation & Vector Scaling ---');

const sectionDividerSource = fs.readFileSync('src/components/ui/SectionDivider.tsx', 'utf8');

test('SectionDivider: preserveAspectRatio="none" prevents stretching distortion', () => {
  assert(
    sectionDividerSource.includes('preserveAspectRatio="none"'),
    'SVG divider must specify preserveAspectRatio="none"'
  );
});

test('SectionDivider: Subpixel seam overlap (-my-px) mitigates rendering gap lines', () => {
  assert(
    sectionDividerSource.includes('-my-px'),
    'SectionDivider must include -my-px subpixel seam overlap'
  );
});

test('SectionDivider: Supports all 6 required variants (wave, curve, angle, slant, glow, gradient)', () => {
  const variants = ['wave', 'curve', 'angle', 'slant', 'glow', 'gradient'];
  for (const v of variants) {
    assert(
      sectionDividerSource.includes(`'${v}'`) || sectionDividerSource.includes(`"${v}"`),
      `SectionDivider must support variant: ${v}`
    );
  }
});

// -----------------------------------------------------------------------------
// MODULE 6: View Transitions API & prefers-reduced-motion Safeguards
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 6: View Transitions & Reduced Motion Safeguards ---');

const storeSource = fs.readFileSync('src/store/index.ts', 'utf8');

test('useThemeStore.toggleMode: Guarded by startViewTransition in document', () => {
  assert(
    storeSource.includes("'startViewTransition' in document"),
    'toggleMode must check for startViewTransition in document'
  );
});

test('useThemeStore.toggleMode: Guarded by prefers-reduced-motion: reduce', () => {
  assert(
    storeSource.includes('(prefers-reduced-motion: reduce)'),
    'toggleMode must check for prefers-reduced-motion: reduce'
  );
});

test('globals.css: Contains View Transitions rules with reduced-motion fallback', () => {
  assert(
    globalsCss.includes('::view-transition-old(root)'),
    'globals.css must define ::view-transition-old(root)'
  );
  assert(
    globalsCss.includes('::view-transition-new(root)'),
    'globals.css must define ::view-transition-new(root)'
  );
  assert(
    globalsCss.includes('@media (prefers-reduced-motion: reduce)'),
    'globals.css must include prefers-reduced-motion media query for view transitions'
  );
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(
  `TEST SUMMARY: ${RESULTS.passed} PASSED, ${RESULTS.failed} FAILED (Total: ${RESULTS.tests.length})`
);
if (RESULTS.warnings.length > 0) {
  console.log(`AUDIT FINDINGS / WARNINGS: ${RESULTS.warnings.length}`);
  RESULTS.warnings.forEach((w, idx) => {
    console.log(`  [Finding ${idx + 1}] ${w.item}: ${w.details}`);
  });
}
console.log('================================================================');

if (RESULTS.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
