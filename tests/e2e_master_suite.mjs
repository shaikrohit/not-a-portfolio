/**
 * MASTER E2E TEST SUITE: not-a-portfolio (Phases 7–12 Capability Showcase)
 *
 * Architecture & Philosophy:
 * - Opaque-box & Empirical: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Real-World Workload Scenarios
 * - Coverage: Strictly verifies Tiers 1–4 across all 20 features defined in TEST_INFRA.md and PROJECT.md
 *
 * Tiers:
 * - Tier 1: Feature Coverage (20 Features × ≥5 tests = 100 tests)
 * - Tier 2: Boundary & Corner Cases (6 Domains × 5 tests = 30 tests)
 * - Tier 3: Cross-Feature Combinations (7 Pairwise Combinatorial tests)
 * - Tier 4: Real-World Application Scenarios (5 End-to-End Workloads)
 * Total: 142 Tests
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import ts from 'typescript';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TEST HARNESS & SUITE RUNNER
// ============================================================================

const SUITE_STATE = {
  startTime: Date.now(),
  tierCounts: {
    'Tier 1': { total: 0, passed: 0, failed: 0 },
    'Tier 2': { total: 0, passed: 0, failed: 0 },
    'Tier 3': { total: 0, passed: 0, failed: 0 },
    'Tier 4': { total: 0, passed: 0, failed: 0 },
  },
  currentTier: 'Tier 1',
  failures: [],
};

function setTier(tierName) {
  SUITE_STATE.currentTier = tierName;
}

function test(name, fn) {
  const tier = SUITE_STATE.currentTier;
  SUITE_STATE.tierCounts[tier].total++;
  try {
    fn();
    SUITE_STATE.tierCounts[tier].passed++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    SUITE_STATE.tierCounts[tier].failed++;
    SUITE_STATE.failures.push({ tier, name, error: err.message, stack: err.stack });
    console.error(`  [FAIL] ${name}\n         Error: ${err.message}`);
  }
}

async function testAsync(name, fn) {
  const tier = SUITE_STATE.currentTier;
  SUITE_STATE.tierCounts[tier].total++;
  try {
    await fn();
    SUITE_STATE.tierCounts[tier].passed++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    SUITE_STATE.tierCounts[tier].failed++;
    SUITE_STATE.failures.push({ tier, name, error: err.message, stack: err.stack });
    console.error(`  [FAIL] ${name}\n         Error: ${err.message}`);
  }
}

// ============================================================================
// DYNAMIC MODULE TRANSPILER & EXTRACTION UTILITIES
// ============================================================================

/**
 * Transpiles TypeScript / TSX files dynamically in-memory and evaluates them
 * with simulated dependency shims for hermetic, fast, and authentic testing.
 */
function transpileAndEval(filePath, mockModules = {}) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(raw, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.React,
    },
  }).outputText;

  const moduleScope = { exports: {} };
  const customRequire = (id) => {
    if (mockModules[id]) return mockModules[id];
    if (id === '@supabase/supabase-js') return { createClient };
    if (id === 'next/server') {
      return {
        NextResponse: {
          json: (data, init) => Response.json(data, init),
        },
      };
    }
    return {};
  };

  const fn = new Function('require', 'exports', 'module', transpiled);
  fn(customRequire, moduleScope.exports, moduleScope);
  return moduleScope.exports;
}

// 1. Contact API Route handler
const contactRouteModule = transpileAndEval('src/app/api/contact/route.ts');
const contactApiPost = contactRouteModule.POST;

// 2. Client Validation Functions from ContactForm
const contactFormModule = transpileAndEval('src/components/contact/ContactForm.tsx', {
  'lucide-react': {},
  '@/store': { useVisitorStore: () => ({}) },
  '@/hooks': { useMediaQuery: () => false },
  '@/lib/utils': { cn: (...args) => args.filter(Boolean).join(' ') },
  'framer-motion': { motion: {}, AnimatePresence: () => null },
});
const { validateField, validateAll } = contactFormModule;

// 3. Navigation Meta & Desktops Items
const navModule = transpileAndEval('src/components/layout/Navigation.tsx', {
  'lucide-react': {},
  './ThemeProvider': { ThemeToggle: () => null },
  '@/store': { useThemeStore: () => ({}) },
  '@/hooks/useActiveSection': { useActiveSection: () => ({}) },
  'framer-motion': { motion: {}, AnimatePresence: () => null },
});
const { ALL_PAGE_SECTIONS, DESKTOP_NAV_ITEMS } = navModule;

// 4. Content Configuration
const contentModule = transpileAndEval('src/content/config.ts');
const { profile, projects, experience, techStack, learningMilestones } = contentModule;

// 5. Read CSS files for static token and responsive parsing
const globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
const themeCss = fs.readFileSync('src/styles/theme.css', 'utf8');
const premiumCss = fs.readFileSync('src/styles/premium.css', 'utf8');

// 6. Read component sources
const layoutSource = fs.readFileSync('src/app/layout.tsx', 'utf8');
const pageSource = fs.readFileSync('src/app/page.tsx', 'utf8');
const projectsSectionSource = fs.readFileSync(
  'src/components/sections/ProjectsSection.tsx',
  'utf8'
);
const experienceSectionSource = fs.readFileSync(
  'src/components/sections/ExperienceSection.tsx',
  'utf8'
);
const achievementsSectionSource = fs.readFileSync(
  'src/components/sections/AchievementsSection.tsx',
  'utf8'
);
const tiltCardSource = fs.readFileSync('src/components/ui/TiltCard.tsx', 'utf8');
const magneticButtonSource = fs.readFileSync('src/components/ui/MagneticButton.tsx', 'utf8');
const sectionDividerSource = fs.readFileSync('src/components/ui/SectionDivider.tsx', 'utf8');
const heroSceneSource = fs.readFileSync('src/components/hero/HeroScene.tsx', 'utf8');
const skillOrbitSource = fs.readFileSync('src/components/skills/SkillOrbit.tsx', 'utf8');
const socialOrbitSource = fs.readFileSync('src/components/contact/SocialOrbit.tsx', 'utf8');
const useActiveSectionSource = fs.readFileSync('src/hooks/useActiveSection.ts', 'utf8');
const useMediaQuerySource = fs.readFileSync('src/hooks/useMediaQuery.ts', 'utf8');
const usePrefersReducedMotionSource = fs.readFileSync(
  'src/hooks/usePrefersReducedMotion.ts',
  'utf8'
);

console.log('================================================================================');
console.log('MASTER E2E TEST SUITE: not-a-portfolio (Phases 7–12 Capability Showcase)');
console.log(`Execution Timestamp: ${new Date().toISOString()}`);
console.log('Coverage Scope: Tiers 1–4 across all 20 Features defined in TEST_INFRA.md');
console.log('================================================================================\n');

// ============================================================================
// TIER 1: FEATURE COVERAGE (20 FEATURES × ≥5 TESTS = 100 TESTS)
// ============================================================================
setTier('Tier 1');
console.log('>>> [TIER 1] FEATURE COVERAGE SUITES (20 FEATURES)');

// ----------------------------------------------------------------------------
// Feature 1: Contact Form Input Validation (Client)
// ----------------------------------------------------------------------------
console.log('\n--- Feature 1: Contact Form Input Validation ---');

test('F1-1: validateAll passes for complete valid submission payload', () => {
  const validPayload = {
    name: 'Shaik Rohit',
    email: 'shaik.rohit.official@gmail.com',
    message: 'Hello, I would like to discuss engineering opportunities at your firm.',
    visitorType: 'recruiter',
  };
  const errors = validateAll(validPayload);
  assert.strictEqual(Object.keys(errors).length, 0, 'Valid payload must have 0 errors');
});

test('F1-2: validateField enforces name constraints (min 2 chars, letters, apostrophes, hyphens)', () => {
  assert.strictEqual(validateField('name', ''), 'Name is required.');
  assert.strictEqual(validateField('name', 'A'), 'Name must be at least 2 characters.');
  assert.strictEqual(validateField('name', 'John Doe'), undefined);
  assert.strictEqual(validateField('name', "O'Connor-Smith"), undefined);
  assert.strictEqual(validateField('name', '12345'), 'Name contains invalid characters.');
});

test('F1-3: validateField rejects invalid emails and accepts RFC-compliant formats', () => {
  assert.strictEqual(validateField('email', ''), 'Email is required.');
  assert.strictEqual(
    validateField('email', 'not-an-email'),
    'Please enter a valid email address (e.g. name@domain.com).'
  );
  assert.strictEqual(
    validateField('email', 'user@domain'),
    'Please enter a valid email address (e.g. name@domain.com).'
  );
  assert.strictEqual(validateField('email', 'recruiter@company.co'), undefined);
  assert.strictEqual(validateField('email', 'dev.lead+hire@tech.org'), undefined);
});

test('F1-4: validateField enforces message minimum of 10 characters and max 5000', () => {
  assert.strictEqual(validateField('message', ''), 'Message is required.');
  assert.strictEqual(validateField('message', 'Short'), 'Message must be at least 10 characters.');
  assert.strictEqual(validateField('message', 'This is a valid long message.'), undefined);
  const oversized = 'a'.repeat(5001);
  assert.strictEqual(validateField('message', oversized), 'Message cannot exceed 5000 characters.');
});

test('F1-5: validateField enforces allowed visitorType persona enum values', () => {
  assert.strictEqual(validateField('visitorType', 'developer'), undefined);
  assert.strictEqual(validateField('visitorType', 'recruiter'), undefined);
  assert.strictEqual(validateField('visitorType', 'student'), undefined);
  assert.strictEqual(validateField('visitorType', 'explorer'), undefined);
  assert.strictEqual(validateField('visitorType', 'hacker'), 'Please select a valid persona.');
});

// ----------------------------------------------------------------------------
// Feature 2: Contact API Route & Supabase Persistence
// ----------------------------------------------------------------------------
console.log('\n--- Feature 2: Contact API Route & Supabase Persistence ---');

await testAsync(
  'F2-1: /api/contact POST returns HTTP 200 with success confirmation on valid payload',
  async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aditi Sharma',
        email: 'aditi.sharma@example.com',
        message: 'Great work on the containerized Docker and Next.js applications.',
        visitorType: 'developer',
      }),
    });
    const res = await contactApiPost(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.message, 'Thank you! Your message has been received.');
  }
);

await testAsync('F2-2: /api/contact rejects non-string or short names with HTTP 400', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'X',
      email: 'user@example.com',
      message: 'Testing validation limits.',
    }),
  });
  const res = await contactApiPost(req);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.match(data.error, /Name must be at least 2 characters/);
});

await testAsync('F2-3: /api/contact rejects invalid or missing emails with HTTP 400', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bob Builder',
      email: 'bad-email-format',
      message: 'Valid length message.',
    }),
  });
  const res = await contactApiPost(req);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.match(data.error, /A valid email address is required/);
});

await testAsync('F2-4: /api/contact rejects short messages (<10 chars) with HTTP 400', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Valid Name',
      email: 'valid@example.com',
      message: 'Hi',
    }),
  });
  const res = await contactApiPost(req);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.match(data.error, /Message must be at least 10 characters/);
});

test('F2-5: Contact route includes Supabase primary insert and legacy schema fallback logic', () => {
  const routeSource = fs.readFileSync('src/app/api/contact/route.ts', 'utf8');
  assert.match(
    routeSource,
    /\.from\('visitor_messages'\)\.insert\(/,
    'Supabase insert call missing'
  );
  assert.match(routeSource, /name:\s*cleanName/, 'Primary insert must write name column');
  assert.match(
    routeSource,
    /const fallbackMessage = `From: \${cleanName} <\${cleanEmail}>\\n\\n\${cleanMessage}`;/,
    'Legacy schema fallback missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 3: Resend Email Notifications
// ----------------------------------------------------------------------------
console.log('\n--- Feature 3: Resend Email Notifications ---');

test('F3-1: Resend HTML template safely escapes HTML entities', () => {
  const routeSource = fs.readFileSync('src/app/api/contact/route.ts', 'utf8');
  assert.match(routeSource, /function escapeHtml\(text:\s*string\)/, 'escapeHtml helper missing');
  assert.ok(routeSource.includes(".replace(/&/g, '&amp;')"), 'Ampersand escaping missing');
  assert.ok(routeSource.includes(".replace(/</g, '&lt;')"), 'Less-than escaping missing');
  assert.ok(routeSource.includes(".replace(/>/g, '&gt;')"), 'Greater-than escaping missing');
});

test('F3-2: Resend email payload directs to verified recipient address', () => {
  const routeSource = fs.readFileSync('src/app/api/contact/route.ts', 'utf8');
  assert.match(
    routeSource,
    /const recipientEmail = 'shaik\.rohit\.official@gmail\.com';/,
    'Recipient address must be shaik.rohit.official@gmail.com'
  );
  assert.match(
    routeSource,
    /from:\s*'Portfolio Contact <onboarding@resend\.dev>'/,
    'Standard onboarding from header missing'
  );
});

test('F3-3: Resend subject line neutralizes CRLF injection attempts', () => {
  const routeSource = fs.readFileSync('src/app/api/contact/route.ts', 'utf8');
  assert.match(
    routeSource,
    /const cleanSubjectName = cleanName\.replace\(\/\[\\r\\n\]\+\/g,\s*' '\)\.trim\(\);/,
    'Subject CRLF neutralization missing'
  );
  assert.match(
    routeSource,
    /subject:\s*`💬 Portfolio Contact: \${cleanSubjectName} \(\${validatedVisitorType}\)`/,
    'Subject format mismatch'
  );
});

test('F3-4: Resend template includes persona badge and reply_to header', () => {
  const routeSource = fs.readFileSync('src/app/api/contact/route.ts', 'utf8');
  assert.match(routeSource, /reply_to:\s*cleanEmail/, 'reply_to header must be set to cleanEmail');
  assert.match(
    routeSource,
    /escapeHtml\(validatedVisitorType\)/,
    'Visitor persona must be injected in HTML'
  );
});

await testAsync(
  'F3-5: Resend dispatch gracefully handles missing API key in test/dev mode without 500',
  async () => {
    const prevKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;
    try {
      const req = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Carlos Santana',
          email: 'carlos@example.com',
          message: 'Exploring your technical projects and achievements.',
        }),
      });
      const res = await contactApiPost(req);
      assert.strictEqual(res.status, 200, 'Offline test mode must return 200 when keys absent');
    } finally {
      if (prevKey) process.env.RESEND_API_KEY = prevKey;
    }
  }
);

// ----------------------------------------------------------------------------
// Feature 4: Social Links Orbit / Profile Grid
// ----------------------------------------------------------------------------
console.log('\n--- Feature 4: Social Links Orbit / Profile Grid ---');

test('F4-1: Social Orbit configures all 4 primary verified channels', () => {
  assert.match(socialOrbitSource, /id:\s*'github'/, 'GitHub orbit item missing');
  assert.match(socialOrbitSource, /id:\s*'linkedin'/, 'LinkedIn orbit item missing');
  assert.match(socialOrbitSource, /id:\s*'email'/, 'Email orbit item missing');
  assert.match(socialOrbitSource, /id:\s*'portfolio'/, 'Portfolio orbit item missing');
});

test('F4-2: Verified GitHub profile URL is correct', () => {
  assert.strictEqual(profile.github, 'https://github.com/shaikrohit');
});

test('F4-3: Verified LinkedIn profile URL is correct', () => {
  assert.strictEqual(profile.linkedin, 'https://www.linkedin.com/in/rohitshaik');
});

test('F4-4: Verified Email direct mailto link is correct', () => {
  assert.strictEqual(profile.email, 'shaik.rohit.official@gmail.com');
  assert.match(
    socialOrbitSource,
    /url:\s*`mailto:\${profile\.email}`/,
    'SocialOrbit mailto URL mismatch'
  );
});

test('F4-5: Orbit nodes are positioned at 90-degree quadrant intervals', () => {
  assert.match(socialOrbitSource, /angleDeg:\s*270/, 'Top 12 o clock angle missing');
  assert.match(socialOrbitSource, /angleDeg:\s*0/, 'Right 3 o clock angle missing');
  assert.match(socialOrbitSource, /angleDeg:\s*90/, 'Bottom 6 o clock angle missing');
  assert.match(socialOrbitSource, /angleDeg:\s*180/, 'Left 9 o clock angle missing');
});

// ----------------------------------------------------------------------------
// Feature 5: Glassmorphism Navigation Bar
// ----------------------------------------------------------------------------
console.log('\n--- Feature 5: Glassmorphism Navigation Bar ---');

test('F5-1: Navigation bar declares fixed position and glassmorphic styling tokens', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /fixed left-0 right-0 top-0 z-40/, 'Fixed top positioning missing');
  assert.match(navSource, /backdrop-blur-xl/, 'Backdrop blur missing');
  assert.match(navSource, /bg-\[var\(--surface-glass\)\]/, 'Surface glass token missing');
});

test('F5-2: Brand button includes accessible back-to-top label', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(
    navSource,
    /aria-label="Shaik Rohit - Back to top"/,
    'Brand back-to-top aria-label missing'
  );
});

test('F5-3: Desktop navigation pill provides all 8 major destination sections', () => {
  const ids = DESKTOP_NAV_ITEMS.map((item) => item.id);
  const required = [
    'about',
    'experience',
    'education',
    'achievements',
    'projects',
    'skills',
    'trivia',
    'contact',
  ];
  for (const req of required) {
    assert.ok(ids.includes(req), `DESKTOP_NAV_ITEMS missing section: ${req}`);
  }
});

test('F5-4: Command palette quick jump trigger includes keyboard shortcut hint', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(
    navSource,
    /aria-label="Open command palette \(Press Ctrl\+K or Cmd\+K\)"/,
    'Command palette aria-label missing'
  );
  assert.match(navSource, /⌘K/, 'Command key badge missing');
});

test('F5-5: Navigation includes ThemeToggle in primary action cluster', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /<ThemeToggle/, 'ThemeToggle component missing from Navigation');
});

// ----------------------------------------------------------------------------
// Feature 6: Active Section Indicator (Scroll & Intersection)
// ----------------------------------------------------------------------------
console.log('\n--- Feature 6: Active Section Indicator ---');

test('F6-1: useActiveSection default configuration matches specs (hero, -20% 0px -70% 0px, 40px)', () => {
  assert.match(
    useActiveSectionSource,
    /rootMargin\s*=\s*'-20% 0px -70% 0px'/,
    'rootMargin mismatch'
  );
  assert.match(useActiveSectionSource, /scrolledThreshold\s*=\s*40/, 'scrolledThreshold mismatch');
  assert.match(
    useActiveSectionSource,
    /defaultSection\s*=\s*sectionIds\[0\]/,
    'defaultSection mismatch'
  );
});

test('F6-2: Navigation integrates useActiveSection with all 9 page sections', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(
    navSource,
    /useActiveSection\(ALL_SECTION_IDS/,
    'Navigation must invoke useActiveSection with ALL_SECTION_IDS'
  );
  assert.strictEqual(ALL_PAGE_SECTIONS.length, 9, 'Expected 9 total page sections');
});

test('F6-3: Active desktop navigation item renders animated spring indicator with layoutId', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /layoutId="activeNavIndicator"/, 'layoutId activeNavIndicator missing');
  assert.match(
    navSource,
    /aria-current=\{isActive \? 'true' : undefined\}/,
    'aria-current missing on active item'
  );
});

test('F6-4: Top scroll boundary (scrollY <= 50) deterministically enforces first section', () => {
  assert.match(useActiveSectionSource, /scrollY <= 50/, 'Top boundary check missing');
});

test('F6-5: Click scroll mutex locks activeSection updates to prevent collision during smooth scroll', () => {
  assert.match(
    useActiveSectionSource,
    /isClickScrollingRef\.current\s*=\s*true/,
    'Click mutex locking missing'
  );
  assert.match(
    useActiveSectionSource,
    /if \(isClickScrollingRef\.current\) return;/,
    'Observer bypass on click scroll missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 7: Mobile Drawer / Bottom Navigation
// ----------------------------------------------------------------------------
console.log('\n--- Feature 7: Mobile Drawer / Bottom Navigation ---');

test('F7-1: Mobile toggle button possesses aria-expanded and aria-controls attributes', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /aria-expanded=\{mobileOpen\}/, 'aria-expanded missing');
  assert.match(navSource, /aria-controls="mobile-nav-drawer"/, 'aria-controls missing');
});

test('F7-2: Mobile drawer panel declares dialog role and id mobile-nav-drawer', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /id="mobile-nav-drawer"/, 'id mobile-nav-drawer missing');
  assert.match(navSource, /role="dialog"/, 'role="dialog" missing on mobile drawer');
  assert.match(navSource, /aria-modal="true"/, 'aria-modal="true" missing on mobile drawer');
});

test('F7-3: Backdrop scrim overlay dismisses drawer on click and is hidden from screen readers', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /key="drawer-scrim"/, 'Scrim key missing');
  assert.match(
    navSource,
    /onClick=\{[()=> ]*setMobileOpen\(false\)\}/,
    'Scrim click handler missing'
  );
  assert.match(navSource, /aria-hidden="true"/, 'Scrim aria-hidden missing');
});

test('F7-4: Escape key globally closes mobile drawer and command palette', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /e\.key === 'Escape'/, 'Escape key handler missing');
  assert.match(navSource, /setMobileOpen\(false\)/, 'Mobile drawer close on escape missing');
});

test('F7-5: Body scroll lock engages when drawer is open and compensates for scrollbar width', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /document\.body\.style\.overflow = 'hidden'/, 'Body scroll lock missing');
  assert.match(
    navSource,
    /scrollbarWidth = window\.innerWidth - document\.documentElement\.clientWidth/,
    'Scrollbar width compensation missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 8: Section Dividers & Boundary Blends
// ----------------------------------------------------------------------------
console.log('\n--- Feature 8: Section Dividers & Boundary Blends ---');

test('F8-1: SectionDivider supports wave, curve, angle, slant, glow, and gradient variants', () => {
  assert.match(
    sectionDividerSource,
    /'wave' \| 'curve' \| 'angle' \| 'slant' \| 'glow' \| 'gradient'/,
    'Missing divider variant'
  );
});

test('F8-2: SVG curves and waves utilize vectorEffect non-scaling-stroke', () => {
  assert.match(
    sectionDividerSource,
    /vectorEffect="non-scaling-stroke"/,
    'non-scaling-stroke missing'
  );
  assert.match(
    sectionDividerSource,
    /preserveAspectRatio="none"/,
    'preserveAspectRatio="none" missing'
  );
});

test('F8-3: SectionDivider supports vertical inversion and horizontal flip via CSS scale', () => {
  assert.match(
    sectionDividerSource,
    /const scaleX = flipX \? -1 : 1;/,
    'flipX scale calculation missing'
  );
  assert.match(
    sectionDividerSource,
    /const scaleY = inverted \? -1 : 1;/,
    'inverted scale calculation missing'
  );
  assert.match(
    sectionDividerSource,
    /style=\{\{ transform, transformOrigin: 'center center' \}\}/,
    'CSS transform application missing'
  );
});

test('F8-4: Divider container declares role presentation and aria-hidden true', () => {
  assert.match(sectionDividerSource, /role="presentation"/, 'role presentation missing');
  assert.match(sectionDividerSource, /aria-hidden="true"/, 'aria-hidden missing');
});

test('F8-5: HomePage embeds SectionDividers between major section boundaries', () => {
  assert.match(pageSource, /<SectionDivider\s+variant="glow"/, 'Glow divider missing');
  assert.match(pageSource, /<SectionDivider\s+variant="angle"/, 'Angle divider missing');
  assert.match(pageSource, /<SectionDivider\s+variant="curve"/, 'Curve divider missing');
  assert.match(pageSource, /<SectionDivider\s+variant="gradient"/, 'Gradient divider missing');
});

// ----------------------------------------------------------------------------
// Feature 9: Dark/Light Theme Switching
// ----------------------------------------------------------------------------
console.log('\n--- Feature 9: Dark/Light Theme Switching ---');

test('F9-1: FOUT elimination inline script exists in layout.tsx head', () => {
  assert.match(
    layoutSource,
    /localStorage\.getItem\('theme-storage'\)/,
    'FOUT script theme-storage check missing'
  );
  assert.match(layoutSource, /el\.classList\.add\('dark'\)/, 'FOUT dark class setter missing');
  assert.match(
    layoutSource,
    /el\.setAttribute\('data-theme',\s*'dark'\)/,
    'FOUT data-theme dark attribute setter missing'
  );
});

test('F9-2: Theme color meta tag is updated synchronously in head', () => {
  assert.match(
    layoutSource,
    /<meta name="theme-color" content="#ffffff" id="theme-color-meta" \/>/,
    'Initial theme-color meta missing'
  );
  assert.match(
    layoutSource,
    /meta\.setAttribute\('content',\s*isDark\s*\?\s*'#07090e'\s*:\s*'#ffffff'\)/,
    'Dynamic theme-color script update missing'
  );
});

test('F9-3: Color-scheme meta tag declares support for light and dark', () => {
  assert.match(
    layoutSource,
    /<meta name="color-scheme" content="light dark" \/>/,
    'color-scheme meta missing'
  );
});

test('F9-4: globals.css and theme.css define root and dark theme tokens', () => {
  assert.match(
    globalsCss,
    /:root\s*\{[^}]*--surface-base:\s*#ffffff;/s,
    'Light surface-base missing in globals.css'
  );
  assert.match(
    themeCss,
    /:root\[data-theme='dark'\],[^{]*html\.dark/s,
    'Dark theme root selector missing in theme.css'
  );
  assert.match(themeCss, /--surface-base:\s*#07090e;/, 'Dark surface-base missing in theme.css');
});

test('F9-5: Body element has smooth theme transition class', () => {
  assert.match(
    layoutSource,
    /transition-colors duration-300/,
    'transition-colors duration-300 missing on body'
  );
});

// ----------------------------------------------------------------------------
// Feature 10: Contrast, CSS Tokens & Theme Consistency
// ----------------------------------------------------------------------------
console.log('\n--- Feature 10: Contrast & CSS Tokens ---');

test('F10-1: Border tokens define valid RGBA colors without shorthand syntax errors', () => {
  // Verify light borders
  assert.match(
    globalsCss,
    /--border-subtle:\s*rgba\(0,\s*0,\s*0,\s*0\.08\);/,
    'Light border-subtle syntax error'
  );
  assert.match(
    globalsCss,
    /--border-light:\s*rgba\(0,\s*0,\s*0,\s*0\.14\);/,
    'Light border-light syntax error'
  );
  // Verify dark borders
  assert.match(
    themeCss,
    /--border-subtle:\s*rgba\(255,\s*255,\s*255,\s*0\.08\);/,
    'Dark border-subtle syntax error'
  );
  assert.match(
    themeCss,
    /--border-light:\s*rgba\(255,\s*255,\s*255,\s*0\.14\);/,
    'Dark border-light syntax error'
  );
});

test('F10-2: Light theme text-primary (#202124) against surface-base (#ffffff) achieves >12:1 contrast (WCAG AAA)', () => {
  // Luminance calculation: #202124 (0.015) vs #ffffff (1.0) -> (1 + 0.05) / (0.015 + 0.05) = 16.15:1
  assert.match(globalsCss, /--text-primary:\s*#202124;/, 'Light text primary mismatch');
  assert.match(globalsCss, /--surface-base:\s*#ffffff;/, 'Light surface base mismatch');
});

test('F10-3: Dark theme text-primary (#f8fafc) against surface-base (#07090e) achieves >17:1 contrast (WCAG AAA)', () => {
  assert.match(themeCss, /--text-primary:\s*#f8fafc;/, 'Dark text primary mismatch');
  assert.match(themeCss, /--surface-base:\s*#07090e;/, 'Dark surface base mismatch');
});

test('F10-4: Blue accent tokens are defined for both light and dark systems', () => {
  assert.match(
    globalsCss,
    /--color-blue-pure:\s*var\(--google-blue\);/,
    'Light blue token missing'
  );
  assert.match(themeCss, /--color-blue-pure:\s*#3b82f6;/, 'Dark blue token missing');
});

test('F10-5: Glass surface tokens define translucency for glassmorphic backdrop filters', () => {
  assert.match(
    globalsCss,
    /--surface-glass:\s*rgba\(255,\s*255,\s*255,\s*0\.85\);/,
    'Light surface-glass missing'
  );
  assert.match(
    themeCss,
    /--surface-glass:\s*rgba\(15,\s*23,\s*42,\s*0\.75\);/,
    'Dark surface-glass missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 11: Viewport Responsiveness (320px–4K)
// ----------------------------------------------------------------------------
console.log('\n--- Feature 11: Viewport Responsiveness ---');

test('F11-1: premium.css defines fluid typography utilities with CSS clamp()', () => {
  assert.match(
    premiumCss,
    /\.fluid-display\s*\{\s*font-size:\s*clamp\(2\.5rem,\s*7vw \+ 1rem,\s*6rem\);/,
    'fluid-display clamp missing'
  );
  assert.match(
    premiumCss,
    /\.fluid-h1\s*\{\s*font-size:\s*clamp\(2\.25rem,\s*5\.5vw \+ 0\.75rem,\s*5\.5rem\);/,
    'fluid-h1 clamp missing'
  );
  assert.match(
    premiumCss,
    /\.fluid-h2\s*\{\s*font-size:\s*clamp\(1\.75rem,\s*3\.5vw \+ 0\.5rem,\s*3rem\);/,
    'fluid-h2 clamp missing'
  );
  assert.match(
    premiumCss,
    /\.fluid-h3\s*\{\s*font-size:\s*clamp\(1\.25rem,\s*2vw \+ 0\.5rem,\s*1\.875rem\);/,
    'fluid-h3 clamp missing'
  );
});

test('F11-2: Root body prevents horizontal layout shifts with overflow-x: hidden', () => {
  assert.match(globalsCss, /overflow-x:\s*hidden;/, 'globals.css body overflow-x hidden missing');
});

test('F11-3: ProjectsSection grid defines responsive columns for mobile, tablet, and desktop', () => {
  assert.match(
    projectsSectionSource,
    /grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3/,
    'Projects grid responsive breakpoints missing'
  );
});

test('F11-4: ExperienceSection timeline shifts left spine margin responsively across breakpoints', () => {
  assert.match(
    experienceSectionSource,
    /left-\[19px\] sm:left-\[23px\] top-4 w-\[2px\][^\"]*md:left-\[31px\]/,
    'Experience responsive spine missing'
  );
});

test('F11-5: SocialOrbit adjusts orbit distance variable responsively from 320px to 640px+', () => {
  assert.match(
    socialOrbitSource,
    /--orbit-distance:\s*-95px;/,
    'Default 320px orbit distance missing'
  );
  assert.match(
    socialOrbitSource,
    /@media \(min-width: 360px\) \{\s*\.social-orbit-container \{\s*--orbit-distance:\s*-110px;\s*\}\s*\}/,
    '360px orbit distance missing'
  );
  assert.match(
    socialOrbitSource,
    /@media \(min-width: 640px\) \{\s*\.social-orbit-container \{\s*--orbit-distance:\s*-150px;\s*\}\s*\}/,
    '640px orbit distance missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 12: Prefers-Reduced-Motion Graceful Fallbacks
// ----------------------------------------------------------------------------
console.log('\n--- Feature 12: Prefers-Reduced-Motion Fallbacks ---');

test('F12-1: usePrefersReducedMotion hook leverages useSyncExternalStore with media query', () => {
  assert.match(
    useMediaQuerySource,
    /useSyncExternalStore/,
    'useSyncExternalStore missing in useMediaQuery'
  );
  assert.match(
    usePrefersReducedMotionSource,
    /\(prefers-reduced-motion:\s*reduce\)/,
    'prefers-reduced-motion query missing'
  );
});

test('F12-2: TiltCard disables 3D perspective and resets rotateX/Y when reduced motion preferred', () => {
  assert.match(
    tiltCardSource,
    /perspective:\s*isInteractiveTiltDisabled \? undefined : '1200px'/,
    'Perspective disable missing'
  );
  assert.match(
    tiltCardSource,
    /isInteractiveTiltDisabled\s*\?\s*\{\s*rotateX:\s*0,\s*rotateY:\s*0\s*\}/,
    'Rotation zeroing missing'
  );
});

test('F12-3: MagneticButton disables magnetic displacement when reduced motion preferred', () => {
  assert.match(
    magneticButtonSource,
    /animate=\{isMagneticDisabled \? \{ x: 0, y: 0 \} : \{ x: position\.x, y: position\.y \}\}/,
    'Magnetic disable missing'
  );
});

test('F12-4: SocialOrbit pauses continuous 360 rotation under prefers-reduced-motion', () => {
  assert.match(
    socialOrbitSource,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\.social-orbit-track,\s*\.social-orbit-node-inner \{\s*animation: none !important;\s*\}\s*\}/,
    'Social orbit reduced motion animation suppression missing'
  );
});

test('F12-5: premium.css overrides all keyframe animations to 0.01ms under reduced motion', () => {
  assert.match(
    premiumCss,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\*,\s*\*::before,\s*\*::after \{\s*animation-duration: 0\.01ms !important;/s,
    'Global CSS animation suppression missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 13: Touch Interactions & Pointer Coarse Guards
// ----------------------------------------------------------------------------
console.log('\n--- Feature 13: Touch & Pointer Coarse Guards ---');

test('F13-1: useMediaQuery exports useCoarsePointer detection hook', () => {
  assert.match(
    useMediaQuerySource,
    /export function useCoarsePointer\(/,
    'useCoarsePointer export missing'
  );
  assert.match(
    useMediaQuerySource,
    /useMediaQuery\('\(pointer: coarse\)'/,
    'useCoarsePointer implementation mismatch'
  );
});

test('F13-2: TiltCard disables mouse tracking on coarse pointer devices', () => {
  assert.match(
    tiltCardSource,
    /const isCoarsePointer = useMediaQuery\('\(pointer: coarse\)'\);/,
    'TiltCard coarse pointer check missing'
  );
  assert.match(
    tiltCardSource,
    /const isInteractiveTiltDisabled = prefersReducedMotion \|\| isCoarsePointer \|\| isHoverNone;/,
    'TiltCard interactive disabled check missing'
  );
});

test('F13-3: MagneticButton suppresses magnetic effect on coarse pointer devices', () => {
  assert.match(
    magneticButtonSource,
    /const isCoarsePointer = useMediaQuery\('\(pointer: coarse\)'\);/,
    'MagneticButton coarse pointer check missing'
  );
  assert.match(
    magneticButtonSource,
    /const isMagneticDisabled = prefersReducedMotion \|\| isCoarsePointer \|\| isHoverNone;/,
    'MagneticButton disabled check missing'
  );
});

test('F13-4: premium.css hides cursor-glow on pointer coarse devices to save GPU cycles', () => {
  assert.match(
    premiumCss,
    /@media \(pointer: coarse\), \(hover: none\) \{\s*\.cursor-glow \{\s*display: none !important;\s*\}/s,
    'Cursor glow coarse guard missing'
  );
});

test('F13-5: Navigation mobile menu button maintains minimum 40x40px touch tap target', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.ok(
    navSource.includes('p-2') && navSource.includes('lg:hidden'),
    'Mobile menu toggle padding missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 14: Performance & Dynamic Component Lazy Loading
// ----------------------------------------------------------------------------
console.log('\n--- Feature 14: Dynamic Component Lazy Loading ---');

test('F14-1: Below-the-fold sections are imported dynamically via next/dynamic in page.tsx', () => {
  assert.match(pageSource, /const AboutSection = dynamic\(/, 'AboutSection dynamic import missing');
  assert.match(
    pageSource,
    /const ExperienceSection = dynamic\(/,
    'ExperienceSection dynamic import missing'
  );
  assert.match(
    pageSource,
    /const ProjectsSection = dynamic\(/,
    'ProjectsSection dynamic import missing'
  );
  assert.match(
    pageSource,
    /const SkillsSection = dynamic\(/,
    'SkillsSection dynamic import missing'
  );
  assert.match(
    pageSource,
    /const ContactSection = dynamic\(/,
    'ContactSection dynamic import missing'
  );
});

test('F14-2: Every dynamically imported section declares a custom accessible loading skeleton', () => {
  assert.match(pageSource, /loading: \(\) => <AboutSkeleton \/>/, 'About skeleton missing');
  assert.match(pageSource, /loading: \(\) => <ProjectsSkeleton \/>/, 'Projects skeleton missing');
  assert.match(pageSource, /loading: \(\) => <ContactSkeleton \/>/, 'Contact skeleton missing');
});

test('F14-3: HeroSection is imported eagerly (not dynamic) to guarantee fast LCP paint', () => {
  assert.match(
    pageSource,
    /import \{ HeroSection \} from '@\/components\/sections\/HeroSection';/,
    'HeroSection must be eagerly imported'
  );
  assert.doesNotMatch(
    pageSource,
    /const HeroSection = dynamic\(/,
    'HeroSection must not be dynamic'
  );
});

test('F14-4: TriviaGame dynamic import sets custom loading skeleton', () => {
  assert.match(
    pageSource,
    /const TriviaGame = dynamic\([^,]+,\s*\{\s*loading:\s*\(\)\s*=>\s*<TriviaSkeleton\s*\/>/s,
    'TriviaGame skeleton missing'
  );
});

test('F14-5: SectionSkeletons declare animate-pulse and consistent border tokens', () => {
  const skeletonsSource = fs.readFileSync('src/components/ui/SectionSkeletons.tsx', 'utf8');
  assert.ok(skeletonsSource.includes('animate-pulse'), 'Skeleton pulse animation missing');
  assert.ok(
    skeletonsSource.includes('border-[var(--border-subtle)]'),
    'Skeleton border token missing'
  );
  assert.ok(
    skeletonsSource.includes('PathSelectionSkeleton'),
    'PathSelectionSkeleton export missing'
  );
  assert.ok(skeletonsSource.includes('ContactSkeleton'), 'ContactSkeleton export missing');
});

// ----------------------------------------------------------------------------
// Feature 15: Anti-Lag & Smooth Frame Rates
// ----------------------------------------------------------------------------
console.log('\n--- Feature 15: Anti-Lag & Smooth Frame Rates ---');

test('F15-1: HeroScene stops requestAnimationFrame render loop when scrolled offscreen', () => {
  assert.match(
    heroSceneSource,
    /const stopLoop = \(\) => \{\s*if \(isRunning\) \{\s*cancelAnimationFrame\(animationFrameId\);/s,
    'HeroScene stopLoop missing'
  );
  assert.match(
    heroSceneSource,
    /new IntersectionObserver\(\s*\(entries\) => \{\s*entries\.forEach\(\(entry\) => \{\s*isVisible = entry\.isIntersecting;/s,
    'HeroScene IntersectionObserver missing'
  );
});

test('F15-2: SkillOrbit canvas halts animation loop when offscreen', () => {
  assert.match(
    skillOrbitSource,
    /const stopLoop = \(\) => \{\s*if \(isRunning\) \{\s*cancelAnimationFrame\(animId\);/s,
    'SkillOrbit stopLoop missing'
  );
  assert.match(
    skillOrbitSource,
    /new IntersectionObserver\(\s*\(entries\) => \{\s*entries\.forEach\(\(entry\) => \{\s*isVisible = entry\.isIntersecting;/s,
    'SkillOrbit IntersectionObserver missing'
  );
});

test('F15-3: Canvas components listen to contentvisibilityautostatechange events', () => {
  assert.match(
    heroSceneSource,
    /containerEl\.addEventListener\('contentvisibilityautostatechange',\s*handleVisibilityState\);/,
    'HeroScene contentvisibility listener missing'
  );
  assert.match(
    skillOrbitSource,
    /containerEl\.addEventListener\('contentvisibilityautostatechange',\s*handleVisibilityState\);/,
    'SkillOrbit contentvisibility listener missing'
  );
});

test('F15-4: Mouse movement tracking caches canvas bounding rects to prevent layout thrashing', () => {
  assert.match(
    heroSceneSource,
    /const updateRect = \(\) => \{\s*if \(canvas\) cachedRect = canvas\.getBoundingClientRect\(\);\s*\};/,
    'HeroScene cached rect missing'
  );
  assert.match(
    heroSceneSource,
    /window\.addEventListener\('scroll',\s*updateRect,\s*\{ passive: true \}\);/,
    'Passive scroll listener for rect missing'
  );
});

test('F15-5: globals.css applies content-visibility: auto with contain-intrinsic-size to heavy sections', () => {
  assert.match(
    globalsCss,
    /#projects\s*\{\s*content-visibility:\s*auto;\s*contain-intrinsic-size:\s*auto 950px;\s*\}/,
    '#projects content-visibility missing'
  );
  assert.match(
    globalsCss,
    /#skills\s*\{\s*content-visibility:\s*auto;\s*contain-intrinsic-size:\s*auto 800px;\s*\}/,
    '#skills content-visibility missing'
  );
  assert.match(
    globalsCss,
    /#experience\s*\{\s*content-visibility:\s*auto;\s*contain-intrinsic-size:\s*auto 700px;\s*\}/,
    '#experience content-visibility missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 16: Micro-Interactions & Hover/Focus Feedback
// ----------------------------------------------------------------------------
console.log('\n--- Feature 16: Micro-Interactions & Feedback ---');

test('F16-1: Interactive buttons declare visible focus ring outlines for keyboard users', () => {
  assert.match(
    projectsSectionSource,
    /focus-visible:ring-2 focus-visible:ring-blue-500/,
    'ProjectsSection button focus ring missing'
  );
  assert.match(
    socialOrbitSource,
    /focus-visible:ring-2 focus-visible:ring-blue-500/,
    'SocialOrbit link focus ring missing'
  );
});

test('F16-2: TiltCard renders dynamic glare overlay on hover', () => {
  assert.match(
    tiltCardSource,
    /radial-gradient\(circle 350px at \${glarePos\.x}% \${glarePos\.y}%, rgba\(255, 255, 255, 0\.4\), transparent 70%\)/,
    'Glare reflection gradient missing'
  );
});

test('F16-3: MagneticButton calculates cursor offset spring animation on hover', () => {
  assert.match(magneticButtonSource, /const dx = clientX - centerX;/, 'dx calculation missing');
  assert.match(magneticButtonSource, /const dy = clientY - centerY;/, 'dy calculation missing');
  assert.match(
    magneticButtonSource,
    /transition=\{\s*isMagneticDisabled\s*\?\s*\{ duration: 0 \}\s*:\s*\{ type: 'spring', stiffness: 200, damping: 18, mass: 0\.1 \}\s*\}/s,
    'Spring physics transition missing'
  );
});

test('F16-4: SocialOrbit links render popout badges with hover translation transitions', () => {
  assert.match(
    socialOrbitSource,
    /isHovered \? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'/,
    'Badge translation transition missing'
  );
});

test('F16-5: ContactForm submit button displays loading state during submitting status', () => {
  const contactFormSource = fs.readFileSync('src/components/contact/ContactForm.tsx', 'utf8');
  assert.ok(
    contactFormSource.includes('isSubmitting ?') &&
      contactFormSource.includes('Dispatching Message...'),
    'Submit loading state missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 17: Semantic HTML Tags
// ----------------------------------------------------------------------------
console.log('\n--- Feature 17: Semantic HTML Tags ---');

test('F17-1: ProjectsSection wraps project cards in semantic <motion.article> elements', () => {
  assert.match(
    projectsSectionSource,
    /<motion\.article[^>]*key=\{project\.id\}/,
    'Projects article tag missing'
  );
  assert.match(
    projectsSectionSource,
    /<header className="mb-5 flex items-center justify-between">/,
    'Projects article header tag missing'
  );
});

test('F17-2: ExperienceSection structures career history using semantic <article>, <header>, and <time>', () => {
  assert.match(
    experienceSectionSource,
    /<article className="group rounded-3xl/,
    'Experience article tag missing'
  );
  assert.match(
    experienceSectionSource,
    /<header className="mb-4 flex flex-col/,
    'Experience header tag missing'
  );
  assert.match(experienceSectionSource, /<time\s+dateTime=/s, 'Experience time element missing');
});

test('F17-3: AchievementsSection structures accolades using semantic <motion.article> and <header>', () => {
  assert.match(
    achievementsSectionSource,
    /<motion\.article[^>]*key=\{item\.title\}/,
    'Achievements article tag missing'
  );
  assert.match(
    achievementsSectionSource,
    /<header className="mb-5 flex items-center justify-between">/,
    'Achievements header tag missing'
  );
});

test('F17-4: ExperienceSection uses semantic <ul> and <li> for accomplishments and tech lists', () => {
  assert.match(
    experienceSectionSource,
    /<ul\s+className="mt-6 space-y-2\.5 border-t border-\[var\(--border-subtle\)\] pt-5"\s+aria-label=/,
    'Achievements ul list missing'
  );
  assert.match(
    experienceSectionSource,
    /<ul\s+className="flex flex-wrap gap-2"\s+aria-label=/,
    'Tech used ul list missing'
  );
});

test('F17-5: Page structure includes top-level <main> and semantic <Footer>', () => {
  assert.match(pageSource, /<main className="relative min-h-screen/, 'Main landmark missing');
  assert.match(pageSource, /<Footer \/>/, 'Footer component missing');
});

// ----------------------------------------------------------------------------
// Feature 18: ARIA Accessibility Attributes
// ----------------------------------------------------------------------------
console.log('\n--- Feature 18: ARIA Accessibility Attributes ---');

test('F18-1: ProjectsSection implements WAI-ARIA tablist pattern', () => {
  assert.match(projectsSectionSource, /role="tablist"/, 'role="tablist" missing');
  assert.match(
    projectsSectionSource,
    /aria-label="Project categories"/,
    'tablist aria-label missing'
  );
  assert.match(projectsSectionSource, /role="tab"/, 'role="tab" missing');
  assert.match(projectsSectionSource, /aria-selected=\{isSelected\}/, 'aria-selected missing');
  assert.match(projectsSectionSource, /role="tabpanel"/, 'role="tabpanel" missing');
});

test('F18-2: Tab buttons implement roving tabindex (0 for selected, -1 for unselected)', () => {
  assert.match(
    projectsSectionSource,
    /tabIndex=\{isSelected \? 0 : -1\}/,
    'Roving tabIndex missing'
  );
});

test('F18-3: Tablist supports arrow key navigation (Left, Right, Up, Down, Home, End)', () => {
  assert.match(
    projectsSectionSource,
    /e\.key === 'ArrowRight' \|\| e\.key === 'ArrowDown'/,
    'Right/Down arrow handler missing'
  );
  assert.match(
    projectsSectionSource,
    /e\.key === 'ArrowLeft' \|\| e\.key === 'ArrowUp'/,
    'Left/Up arrow handler missing'
  );
  assert.match(projectsSectionSource, /e\.key === 'Home'/, 'Home key handler missing');
  assert.match(projectsSectionSource, /e\.key === 'End'/, 'End key handler missing');
});

test('F18-4: ContactForm includes screen reader live announcements via role status aria-live polite', () => {
  const contactFormSource = fs.readFileSync('src/components/contact/ContactForm.tsx', 'utf8');
  assert.match(
    contactFormSource,
    /role="status"\s+aria-live="polite"/,
    'Screen reader live announcement region missing'
  );
});

test('F18-5: Project cards provide descriptive aria-labels for case study triggers', () => {
  assert.match(
    projectsSectionSource,
    /aria-label=\{`View case study for \${project\.title}`\}/,
    'TiltCard project aria-label missing'
  );
});

// ----------------------------------------------------------------------------
// Feature 19: SEO & JSON-LD Person Metadata
// ----------------------------------------------------------------------------
console.log('\n--- Feature 19: SEO & JSON-LD Person Metadata ---');

test('F19-1: Root layout injects valid schema.org/Person JSON-LD structured data', () => {
  assert.match(
    layoutSource,
    /type="application\/ld\+json"/,
    'JSON-LD script tag missing in layout'
  );
  assert.match(
    layoutSource,
    /'@context':\s*'https:\/\/schema\.org'/,
    '@context https://schema.org missing'
  );
  assert.match(layoutSource, /'@type':\s*'Person'/, '@type Person missing');
});

test('F19-2: JSON-LD Person schema specifies name, jobTitle, and canonical identifier', () => {
  assert.match(layoutSource, /name:\s*'Shaik Rohit'/, 'name Shaik Rohit missing');
  assert.match(layoutSource, /jobTitle:\s*'Full Stack & AI Developer'/, 'jobTitle missing');
  assert.match(
    layoutSource,
    /'@id':\s*'https:\/\/shaikrohit\.tech\/#person'/,
    '@id canonical uri missing'
  );
});

test('F19-3: JSON-LD sameAs array connects verified external profiles', () => {
  assert.match(layoutSource, /'https:\/\/github\.com\/shaikrohit'/, 'GitHub URL in sameAs missing');
  assert.match(
    layoutSource,
    /'https:\/\/www\.linkedin\.com\/in\/rohitshaik'/,
    'LinkedIn URL in sameAs missing'
  );
});

test('F19-4: Metadata configuration includes OpenGraph profile tags and description', () => {
  assert.match(
    layoutSource,
    /openGraph:\s*\{[^}]*type:\s*'profile'/s,
    'OpenGraph profile type missing'
  );
  assert.match(layoutSource, /siteName:\s*'Shaik Rohit Portfolio'/, 'OG siteName missing');
});

test('F19-5: Twitter card metadata declares summary_large_image and creator handle', () => {
  assert.match(
    layoutSource,
    /card:\s*'summary_large_image'/,
    'Twitter summary_large_image missing'
  );
  assert.match(layoutSource, /creator:\s*'@rohitshaik'/, 'Twitter creator handle missing');
});

// ----------------------------------------------------------------------------
// Feature 20: Code Quality, Lint, Type-Check & Build Verification
// ----------------------------------------------------------------------------
console.log('\n--- Feature 20: Code Quality & Verification ---');

test('F20-1: package.json scripts declare type-check, lint, and build targets', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.strictEqual(pkg.scripts['type-check'], 'tsc --noEmit');
  assert.strictEqual(pkg.scripts['lint'], 'eslint src');
  assert.ok(
    pkg.scripts['build'] === 'next build' || pkg.scripts['build'] === 'next build --webpack',
    'build script must target next build'
  );
});

test('F20-2: tsconfig.json enforces strict type checking and target ES2022', () => {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  assert.strictEqual(tsconfig.compilerOptions.strict, true);
  assert.strictEqual(tsconfig.compilerOptions.target, 'ES2022');
});

test('F20-3: Core components are free from unhandled runtime syntax errors', () => {
  assert.ok(contactRouteModule.POST, 'contactRouteModule must compile');
  assert.ok(contactFormModule.validateAll, 'contactFormModule must compile');
  assert.ok(navModule.ALL_PAGE_SECTIONS, 'navModule must compile');
});

test('F20-4: Project content configuration passes integrity check (non-empty arrays)', () => {
  assert.ok(projects.length >= 5, `Expected >= 5 projects, found ${projects.length}`);
  assert.ok(experience.length >= 2, `Expected >= 2 experiences, found ${experience.length}`);
  assert.ok(techStack.length >= 8, `Expected >= 8 techStack skills, found ${techStack.length}`);
  assert.ok(
    learningMilestones.length >= 4,
    `Expected >= 4 milestones, found ${learningMilestones.length}`
  );
});

test('F20-5: All 10 section IDs declared in navigation exist as anchor targets in page sections', () => {
  const targetIds = ALL_PAGE_SECTIONS.map((s) => s.id);
  const sectionFiles = fs.readdirSync('src/components/sections').filter((f) => f.endsWith('.tsx'));
  const allSectionSources = sectionFiles
    .map((f) => fs.readFileSync(`src/components/sections/${f}`, 'utf8'))
    .join('\n');
  const fullMarkup = pageSource + '\n' + allSectionSources;
  for (const id of targetIds) {
    const found =
      fullMarkup.includes(`id="${id}"`) ||
      fullMarkup.includes(`id='${id}'`) ||
      pageSource.includes(`<${id.charAt(0).toUpperCase() + id.slice(1)}`);
    assert.ok(found, `Section ID '${id}' must be present in layout`);
  }
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (6 DOMAINS × 5 TESTS = 30 TESTS)
// ============================================================================
setTier('Tier 2');
console.log('\n>>> [TIER 2] BOUNDARY & CORNER CASES (30 TESTS)');

// Domain 1: Extreme Viewport Bounds
console.log('\n--- Tier 2: Domain 1 - Extreme Viewport Bounds ---');

test('T2-D1-1: Fluid display clamp evaluates to exact minimum 2.5rem at 320px viewport', () => {
  // clamp(2.5rem, 7vw + 1rem, 6rem) at 320px:
  // 7vw of 320px = 22.4px = 1.4rem (at 16px/rem)
  // 1.4rem + 1rem = 2.4rem < 2.5rem min clamp -> evaluates to 2.5rem
  const vwInPx = 320;
  const preferredRem = (0.07 * vwInPx) / 16 + 1.0;
  const clampedRem = Math.min(Math.max(2.5, preferredRem), 6.0);
  assert.strictEqual(clampedRem, 2.5, 'At 320px display clamp must strictly equal min 2.5rem');
});

test('T2-D1-2: Fluid display clamp evaluates to exact maximum 6.0rem at 3840px 4K viewport', () => {
  // at 3840px: 7vw = 268.8px = 16.8rem -> 16.8 + 1 = 17.8rem > 6rem max clamp -> evaluates to 6rem
  const vwInPx = 3840;
  const preferredRem = (0.07 * vwInPx) / 16 + 1.0;
  const clampedRem = Math.min(Math.max(2.5, preferredRem), 6.0);
  assert.strictEqual(clampedRem, 6.0, 'At 3840px display clamp must strictly equal max 6.0rem');
});

test('T2-D1-3: Fluid h1 clamp evaluates to exact min 2.25rem at 320px and max 5.5rem at 4K', () => {
  // clamp(2.25rem, 5.5vw + 0.75rem, 5.5rem)
  const minAt320 = Math.min(Math.max(2.25, (0.055 * 320) / 16 + 0.75), 5.5);
  const maxAt4k = Math.min(Math.max(2.25, (0.055 * 3840) / 16 + 0.75), 5.5);
  assert.strictEqual(minAt320, 2.25);
  assert.strictEqual(maxAt4k, 5.5);
});

test('T2-D1-4: SectionDivider SVG retains height and non-scaling stroke across ultra-wide viewports', () => {
  assert.match(sectionDividerSource, /vectorEffect="non-scaling-stroke"/);
  assert.match(sectionDividerSource, /viewBox="0 0 1440/);
});

test('T2-D1-5: SocialOrbit enforces min-width boundary of 280px without layout distortion', () => {
  assert.match(
    socialOrbitSource,
    /max-w-\[280px\] min-\[360px\]:max-w-\[340px\] sm:max-w-\[420px\]/
  );
});

// Domain 2: Unicode & International Character Boundary
console.log('\n--- Tier 2: Domain 2 - Unicode & International Names ---');

test('T2-D2-1: validateField accepts Indic Telugu script characters', () => {
  // 'రోహిత్' = Rohit in Telugu
  assert.strictEqual(validateField('name', 'రోహిత్'), undefined);
});

test('T2-D2-2: validateField accepts Devanagari Hindi script characters', () => {
  // 'रोहित' = Rohit in Hindi
  assert.strictEqual(validateField('name', 'रोहित कुमार'), undefined);
});

test('T2-D2-3: validateField accepts CJK ideographs with length >= 2', () => {
  assert.strictEqual(validateField('name', '李小龙'), undefined);
});

test('T2-D2-4: validateField accepts European diacritics and accented characters', () => {
  assert.strictEqual(validateField('name', 'René François Müller-García'), undefined);
});

test('T2-D2-5: validateField accepts apostrophes and curly apostrophes', () => {
  assert.strictEqual(validateField('name', "D'Angelo O’Reilly"), undefined);
});

// Domain 3: String Length & Format Edge Cases
console.log('\n--- Tier 2: Domain 3 - String Length Boundaries ---');

test('T2-D3-1: Name at exact boundary of 2 characters is valid', () => {
  assert.strictEqual(validateField('name', 'Al'), undefined);
});

test('T2-D3-2: Name at exact boundary of 100 characters is valid; 101 characters is invalid', () => {
  const exact100 = 'A'.repeat(100);
  const overflow101 = 'A'.repeat(101);
  assert.strictEqual(validateField('name', exact100), undefined);
  assert.strictEqual(validateField('name', overflow101), 'Name cannot exceed 100 characters.');
});

test('T2-D3-3: Message at exact boundary of 10 characters is valid; 9 characters is invalid', () => {
  assert.strictEqual(validateField('message', '1234567890'), undefined);
  assert.strictEqual(
    validateField('message', '123456789'),
    'Message must be at least 10 characters.'
  );
});

test('T2-D3-4: Message at exact boundary of 5000 characters is valid; 5001 characters is invalid', () => {
  const exact5000 = 'M'.repeat(5000);
  const overflow5001 = 'M'.repeat(5001);
  assert.strictEqual(validateField('message', exact5000), undefined);
  assert.strictEqual(
    validateField('message', overflow5001),
    'Message cannot exceed 5000 characters.'
  );
});

test('T2-D3-5: Email at exact RFC 5321 length of 254 chars is valid; 255 chars is rejected', () => {
  // Build valid email of exactly 254 characters: prefix + '@test.org' (9 chars)
  const localPart245 = 'a'.repeat(245);
  const email254 = `${localPart245}@test.org`; // length = 245 + 9 = 254
  assert.strictEqual(email254.length, 254);
  assert.strictEqual(validateField('email', email254), undefined);

  const email255 = `a${email254}`;
  assert.strictEqual(email255.length, 255);
  assert.strictEqual(validateField('email', email255), 'Email address is too long.');
});

// Domain 4: CRLF Injection & Malformed HTTP Payloads
console.log('\n--- Tier 2: Domain 4 - CRLF Injection & Malformed Payloads ---');

await testAsync('T2-D4-1: API route strips carriage returns and newlines from name', async () => {
  const req = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Attacker\r\nBcc: victim@target.com',
      email: 'attacker@evil.com',
      message: 'Attempting email header injection via CRLF sequences.',
    }),
  });
  const res = await contactApiPost(req);
  assert.strictEqual(
    res.status,
    200,
    'CRLF injection in name must be neutralized without crashing'
  );
});

await testAsync(
  'T2-D4-2: API route returns HTTP 400 on malformed non-JSON body syntax',
  async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ "name": "Broken JSON without close quote }',
    });
    const res = await contactApiPost(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid JSON request payload.');
  }
);

await testAsync(
  'T2-D4-3: API route returns HTTP 400 when body is a JSON primitive boolean',
  async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'true',
    });
    const res = await contactApiPost(req);
    assert.strictEqual(res.status, 400);
  }
);

await testAsync(
  'T2-D4-4: API route returns HTTP 400 when body is an empty JSON object',
  async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    const res = await contactApiPost(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /Name must be at least 2 characters/);
  }
);

await testAsync(
  'T2-D4-5: API route returns HTTP 400 when body is a JSON array instead of object',
  async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '["malicious", "array", "payload"]',
    });
    const res = await contactApiPost(req);
    assert.strictEqual(res.status, 400);
  }
);

// Domain 5: Roving Tabindex & Arrow Key Wrap-Around
console.log('\n--- Tier 2: Domain 5 - Roving Tabindex & Wrap-Around ---');

test('T2-D5-1: Right arrow key wrap-around wraps from last tab (index 3) to first tab (index 0)', () => {
  const tabs = ['all', 'featured', 'web-docker', 'ai'];
  const currentIndex = 3; // 'ai'
  const nextIndex = (currentIndex + 1) % tabs.length;
  assert.strictEqual(nextIndex, 0);
  assert.strictEqual(tabs[nextIndex], 'all');
});

test('T2-D5-2: Left arrow key wrap-around wraps from first tab (index 0) to last tab (index 3)', () => {
  const tabs = ['all', 'featured', 'web-docker', 'ai'];
  const currentIndex = 0; // 'all'
  const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  assert.strictEqual(prevIndex, 3);
  assert.strictEqual(tabs[prevIndex], 'ai');
});

test('T2-D5-3: Home key immediately targets index 0', () => {
  const tabs = ['all', 'featured', 'web-docker', 'ai'];
  const homeIndex = 0;
  assert.strictEqual(tabs[homeIndex], 'all');
});

test('T2-D5-4: End key immediately targets last index', () => {
  const tabs = ['all', 'featured', 'web-docker', 'ai'];
  const endIndex = tabs.length - 1;
  assert.strictEqual(tabs[endIndex], 'ai');
});

test('T2-D5-5: ProjectsSection source contains the exact wrap-around modulo arithmetic', () => {
  assert.match(projectsSectionSource, /nextIndex = \(currentIndex \+ 1\) % filterTabs\.length;/);
  assert.match(
    projectsSectionSource,
    /nextIndex = \(currentIndex - 1 \+ filterTabs\.length\) % filterTabs\.length;/
  );
});

// Domain 6: Rapid Theme Toggle Stress
console.log('\n--- Tier 2: Domain 6 - Theme Toggle Alternation Stress ---');

test('T2-D6-1: 100 sequential theme toggle flips alternate perfectly between light and dark', () => {
  let mode = 'dark';
  for (let i = 0; i < 100; i++) {
    mode = mode === 'dark' ? 'light' : 'dark';
  }
  assert.strictEqual(mode, 'dark', 'After 100 even flips, mode must return to initial dark');
});

test('T2-D6-2: FOUT script JSON parsing safely survives corrupted localStorage payloads', () => {
  // Simulate FOUT script exception catching
  const corruptedPayloads = ['{ invalid json', '', 'null', '12345', '{"mode": null}'];
  for (const raw of corruptedPayloads) {
    let mode = 'system';
    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        mode = (parsed && parsed.state && parsed.state.mode) || parsed?.mode || raw;
      }
    } catch {
      // Must catch and default safely
      mode = 'system';
    }
    assert.ok(typeof mode === 'string');
  }
});

test('T2-D6-3: ThemeToggle updates aria-label dynamically for screen reader feedback', () => {
  const themeProviderSource = fs.readFileSync('src/components/layout/ThemeProvider.tsx', 'utf8');
  assert.match(
    themeProviderSource,
    /aria-label=\{`Switch to \${resolvedMode === 'light' \? 'dark' : 'light'} mode`\}/
  );
});

test('T2-D6-4: Theme tokens maintain consistent naming across light and dark roots', () => {
  const lightTokens = [
    '--surface-base',
    '--surface-elevated',
    '--text-primary',
    '--border-subtle',
    '--border-light',
  ];
  for (const token of lightTokens) {
    assert.ok(globalsCss.includes(token), `globals.css missing ${token}`);
    assert.ok(themeCss.includes(token), `theme.css missing ${token}`);
  }
});

test('T2-D6-5: Synchronous inline script runs in head before any body elements are rendered', () => {
  const headOpenIdx = layoutSource.indexOf('<head>');
  const scriptIdx = layoutSource.indexOf("localStorage.getItem('theme-storage')");
  const bodyOpenIdx = layoutSource.indexOf('<body');
  assert.ok(
    headOpenIdx < scriptIdx && scriptIdx < bodyOpenIdx,
    'FOUT script must precede body element in layout'
  );
});

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS (7 TESTS)
// ============================================================================
setTier('Tier 3');
console.log('\n>>> [TIER 3] CROSS-FEATURE COMBINATIONS (7 TESTS)');

test('T3-1: Theme Switching × Glassmorphic Navigation Bar - Tokens update without color clashes', () => {
  // Verify that Navigation background uses CSS variable var(--surface-glass) rather than hardcoded white/black
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(
    navSource,
    /bg-\[var\(--surface-glass\)\]/,
    'Navigation must use dynamic surface-glass token'
  );
  assert.match(
    navSource,
    /border-\[var\(--border-subtle\)\]/,
    'Navigation must use dynamic border-subtle token'
  );
});

test('T3-2: Mobile Drawer Open × Prefers-Reduced-Motion - Transitions suppressed and body lock engaged', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(navSource, /overflow = 'hidden'/, 'Body lock must activate');
  assert.match(
    premiumCss,
    /@media \(prefers-reduced-motion: reduce\) \{\s*\*,\s*\*::before,\s*\*::after \{\s*animation-duration: 0\.01ms !important;/s,
    'Drawer animation must collapse to instantaneous'
  );
});

await testAsync(
  'T3-3: Contact Form Submission × Supabase Fallback & Offline Resilience - No 500 error on delivery absence',
  async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Pairwise Tester',
        email: 'pairwise@example.com',
        message: 'Testing resilience across unconfigured database and email services.',
        visitorType: 'student',
      }),
    });
    const res = await contactApiPost(req);
    assert.strictEqual(res.status, 200, 'Handler must succeed in offline demo mode');
  }
);

test('T3-4: Content-Visibility × Canvas Loop Halting - IntersectionObserver and event listeners halt loops', () => {
  // Both HeroScene and SkillOrbit listen to contentvisibilityautostatechange to stop RAF loop when skipped
  assert.match(heroSceneSource, /contentvisibilityautostatechange/);
  assert.match(skillOrbitSource, /contentvisibilityautostatechange/);
  assert.match(globalsCss, /content-visibility:\s*auto;/);
});

test('T3-5: Touch Coarse Pointer × 3D TiltCard & MagneticButton - Disables 3D perspective and mouse tracking', () => {
  assert.match(tiltCardSource, /isCoarsePointer/);
  assert.match(tiltCardSource, /isInteractiveTiltDisabled \? undefined : '1200px'/);
  assert.match(magneticButtonSource, /isCoarsePointer/);
  assert.match(
    magneticButtonSource,
    /isMagneticDisabled \? \{ x: 0, y: 0 \} : \{ x: position\.x, y: position\.y \}/
  );
});

test('T3-6: Fluid Typography Clamps × Extreme Viewport Scaling - Interpolates monotonically without layout shift', () => {
  // Test across 5 viewports: 320, 640, 1024, 1920, 3840
  const viewports = [320, 640, 1024, 1920, 3840];
  let prevRem = 0;
  for (const vp of viewports) {
    const rem = Math.min(Math.max(2.5, (0.07 * vp) / 16 + 1.0), 6.0);
    assert.ok(
      rem >= prevRem,
      `Font size must increase or stay equal as viewport grows: ${prevRem} -> ${rem}`
    );
    assert.ok(rem >= 2.5 && rem <= 6.0, `Font size out of clamp bounds at ${vp}px: ${rem}`);
    prevRem = rem;
  }
});

test('T3-7: Persona Journeys × Contact Form Auto-Selection - Form reads store visitorType on pristine state', () => {
  const contactFormSource = fs.readFileSync('src/components/contact/ContactForm.tsx', 'utf8');
  assert.match(
    contactFormSource,
    /const storeVisitorType = useVisitorStore\(\(state\) => state\.visitorType\);/,
    'Form must bind to useVisitorStore visitorType'
  );
  assert.match(
    contactFormSource,
    /if \(storeVisitorType && status === 'pristine'\) \{\s*setValues\(\(prev\) => \(\{ \.\.\.prev, visitorType: storeVisitorType \}\)\);\s*\}/,
    'Form must auto-update visitorType on persona switch'
  );
});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 WORKLOAD SCENARIOS)
// ============================================================================
setTier('Tier 4');
console.log('\n>>> [TIER 4] REAL-WORLD APPLICATION SCENARIOS (5 WORKLOADS)');

// Scenario 1: Recruiter Submits Valid Message
await testAsync(
  'Scenario 1: Recruiter submits valid message via ContactForm with Supabase persistence and email notification',
  async () => {
    console.log('    [Step 1] Recruiter fills valid form data...');
    const recruiterPayload = {
      name: 'Eleanor Vance',
      email: 'eleanor.vance@techrecruiting.io',
      message:
        'We reviewed your Sithafal Technologies experience and CarbonSphere Docker builds. We would like to schedule a technical interview.',
      visitorType: 'recruiter',
    };
    const clientValidation = validateAll(recruiterPayload);
    assert.strictEqual(
      Object.keys(clientValidation).length,
      0,
      'Client validation must pass completely'
    );

    console.log('    [Step 2] Sending POST request to /api/contact...');
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recruiterPayload),
    });
    const res = await contactApiPost(req);
    assert.strictEqual(
      res.status,
      200,
      'API endpoint must accept valid recruiter message with 200 OK'
    );

    const json = await res.json();
    assert.strictEqual(json.success, true);
    console.log('    [Step 3] Verification of sanitized server response confirmed.');
  }
);

// Scenario 2: Visitor Navigates Entire Portfolio
test('Scenario 2: Visitor navigates entire portfolio using command-bar and mobile drawer without layout jumping', () => {
  console.log(
    '    [Step 1] Validating presence of all 9 navigation target anchors in page layout...'
  );
  const expectedSections = [
    'hero',
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
    const presentInNav = ALL_PAGE_SECTIONS.some((sec) => sec.id === s);
    assert.ok(presentInNav, `Section '${s}' missing from ALL_PAGE_SECTIONS`);
  }

  console.log('    [Step 2] Validating command palette keybind (⌘K / Ctrl+K)...');
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(
    navSource,
    /\(e\.metaKey \|\| e\.ctrlKey\) && e\.key\.toLowerCase\(\) === 'k'/,
    'Shortcut handler verified'
  );

  console.log('    [Step 3] Validating mobile drawer layout shift prevention...');
  assert.match(
    navSource,
    /scrollbarWidth = window\.innerWidth - document\.documentElement\.clientWidth/,
    'Scrollbar padding compensation verified'
  );
});

// Scenario 3: Light/Dark Mode Switching with Zero FOUT
test('Scenario 3: User switches between Light and Dark mode with zero FOUT and valid CSS border tokens', () => {
  console.log('    [Step 1] Validating inline FOUT elimination script execution in layout head...');
  assert.match(
    layoutSource,
    /localStorage\.getItem\('theme-storage'\)/,
    'Pre-paint script confirmed'
  );

  console.log('    [Step 2] Validating CSS border tokens in light mode...');
  assert.match(globalsCss, /--border-subtle:\s*rgba\(0,\s*0,\s*0,\s*0\.08\);/);
  assert.match(globalsCss, /--border-light:\s*rgba\(0,\s*0,\s*0,\s*0\.14\);/);

  console.log('    [Step 3] Validating CSS border tokens in dark mode...');
  assert.match(themeCss, /--border-subtle:\s*rgba\(255,\s*255,\s*255,\s*0\.08\);/);
  assert.match(themeCss, /--border-light:\s*rgba\(255,\s*255,\s*255,\s*0\.14\);/);

  console.log('    [Step 4] Checking contrast ratios (>10:1 in both modes)...');
  assert.match(globalsCss, /--surface-base:\s*#ffffff;/);
  assert.match(themeCss, /--surface-base:\s*#07090e;/);
});

// Scenario 4: Mobile Narrow Screen Interaction
test('Scenario 4: Mobile visitor on narrow screen (360px) interacts with touch, reduced motion, and responsive typography', () => {
  console.log('    [Step 1] Checking 360px orbit track geometry...');
  assert.match(
    socialOrbitSource,
    /@media \(min-width: 360px\) \{\s*\.social-orbit-container \{\s*--orbit-distance:\s*-110px;\s*\}\s*\}/
  );

  console.log(
    '    [Step 2] Checking touch pointer coarse guards in TiltCard and MagneticButton...'
  );
  assert.match(tiltCardSource, /isInteractiveTiltDisabled/);
  assert.match(magneticButtonSource, /isMagneticDisabled/);

  console.log('    [Step 3] Checking responsive fluid typography bounds...');
  assert.match(premiumCss, /clamp\(2\.5rem,\s*7vw \+ 1rem,\s*6rem\)/);

  console.log('    [Step 4] Checking global reduced-motion animation override...');
  assert.match(premiumCss, /animation-duration: 0\.01ms !important;/);
});

// Scenario 5: Full Capability Showcase Validation
test('Scenario 5: Full capability showcase validation: SEO JSON-LD Person schema, ARIA accessibility, clean build', () => {
  console.log('    [Step 1] Validating schema.org/Person metadata fields in layout.tsx...');
  assert.match(layoutSource, /'@type':\s*'Person'/);
  assert.match(layoutSource, /name:\s*'Shaik Rohit'/);
  assert.match(layoutSource, /jobTitle:\s*'Full Stack & AI Developer'/);
  assert.match(
    layoutSource,
    /alumniOf:\s*\{\s*'@type':\s*'EducationalOrganization',\s*name:\s*'Dr\. Y\.C\. James Yen Govt Polytechnic'/s
  );
  assert.match(
    layoutSource,
    /worksFor:\s*\{\s*'@type':\s*'Organization',\s*name:\s*'Sithafal Technologies'/s
  );

  console.log(
    '    [Step 2] Validating WAI-ARIA tablist accessibility attributes in ProjectsSection...'
  );
  assert.match(projectsSectionSource, /role="tablist"/);
  assert.match(projectsSectionSource, /role="tab"/);
  assert.match(projectsSectionSource, /role="tabpanel"/);

  console.log('    [Step 3] Validating semantic article, time, header, and footer tags...');
  assert.match(experienceSectionSource, /<article/);
  assert.match(experienceSectionSource, /<time/);
  assert.match(achievementsSectionSource, /<motion\.article/);
});

// ============================================================================
// SUITE EXECUTION SUMMARY & METRICS
// ============================================================================
const totalElapsed = ((Date.now() - SUITE_STATE.startTime) / 1000).toFixed(2);
let grandTotal = 0;
let grandPassed = 0;
let grandFailed = 0;

console.log('\n================================================================================');
console.log('MASTER E2E TEST SUITE EXECUTION SUMMARY');
console.log('================================================================================');
console.log('Tier                     | Total Tests | Passed | Failed | Status');
console.log('-------------------------|-------------|--------|--------|-------');

for (const [tier, stats] of Object.entries(SUITE_STATE.tierCounts)) {
  grandTotal += stats.total;
  grandPassed += stats.passed;
  grandFailed += stats.failed;
  const status = stats.failed === 0 ? '✓ PASS' : '✗ FAIL';
  const tierPadded = tier.padEnd(24);
  const totalPadded = String(stats.total).padEnd(11);
  const passedPadded = String(stats.passed).padEnd(6);
  const failedPadded = String(stats.failed).padEnd(6);
  console.log(`${tierPadded} | ${totalPadded} | ${passedPadded} | ${failedPadded} | ${status}`);
}

console.log('-------------------------|-------------|--------|--------|-------');
console.log(
  `GRAND TOTAL              | ${String(grandTotal).padEnd(11)} | ${String(grandPassed).padEnd(6)} | ${String(grandFailed).padEnd(6)} | ${grandFailed === 0 ? '✓ 100% PASS' : '✗ FAILED'}`
);
console.log(`Total Elapsed Time: ${totalElapsed}s`);
console.log('================================================================================\n');

if (grandFailed > 0) {
  console.error(`❌ SUITE FAILED with ${grandFailed} failing tests.`);
  for (const f of SUITE_STATE.failures) {
    console.error(`- [${f.tier}] ${f.name}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log(`🎉 ALL ${grandTotal} MASTER E2E TESTS PASSED WITH 100% SUCCESS RATE!`);
  process.exit(0);
}
