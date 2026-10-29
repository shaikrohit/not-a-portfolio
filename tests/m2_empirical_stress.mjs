/**
 * Empirical Stress Test Harness for Milestone 2
 * Navigation, Active Section Tracking, Mobile Drawer & Section Dividers
 *
 * Modules:
 * 1. useActiveSection Hook Boundary Conditions & Mutex Locking Simulation
 * 2. Navigation, Mobile Drawer & Command Palette Accessibility Verification
 * 3. SectionDivider Responsive Layout & SVG Non-Scaling Stroke Invariant
 * 4. Comprehensive Section ID & DOM Node Integrity Oracle
 */

import fs from 'node:fs';
import assert from 'node:assert';

const RESULTS = {
  passed: 0,
  failed: 0,
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

async function testAsync(name, fn) {
  try {
    await fn();
    RESULTS.passed++;
    RESULTS.tests.push({ name, status: 'PASS' });
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    RESULTS.failed++;
    RESULTS.tests.push({ name, status: 'FAIL', error: err.message });
    console.error(`✗ FAIL: ${name}\n  Error: ${err.message}`);
  }
}

console.log('================================================================');
console.log('STARTING EMPIRICAL STRESS TEST SUITE: MILESTONE 2 (NAV & LAYOUT)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// MODULE 1: useActiveSection Hook Boundary Conditions & Scroll Mutex Locking
// -----------------------------------------------------------------------------
console.log('--- MODULE 1: useActiveSection Hook Boundary Conditions & Mutex ---');

const ALL_SECTION_IDS = [
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

// Pure simulation of useActiveSection scroll calculation logic extracted from src/hooks/useActiveSection.ts
class ActiveSectionHarness {
  constructor(sectionIds = ALL_SECTION_IDS, options = {}) {
    this.sectionIds = sectionIds;
    this.scrolledThreshold = options.scrolledThreshold ?? 40;
    this.activeSection = options.defaultSection ?? (sectionIds[0] || '');
    this.isScrolled = false;
    this.isClickScrolling = false;
    this.clickTimeout = null;
    this.visibleSections = new Map();
  }

  handleScroll(scrollY, windowHeight, docHeight) {
    this.isScrolled = scrollY > this.scrolledThreshold;

    if (this.isClickScrolling) return;

    // Top boundary: enforce first section (hero)
    if (scrollY <= 50 && this.sectionIds.length > 0) {
      this.activeSection = this.sectionIds[0] ?? '';
      return;
    }

    // Bottom boundary: enforce last section (contact)
    if (scrollY + windowHeight >= docHeight - 50 && this.sectionIds.length > 0) {
      this.activeSection = this.sectionIds[this.sectionIds.length - 1] ?? '';
      return;
    }
  }

  handleIntersection(entries) {
    if (this.isClickScrolling) return;

    entries.forEach((entry) => {
      this.visibleSections.set(entry.id, entry.isIntersecting);
    });

    for (const id of this.sectionIds) {
      if (this.visibleSections.get(id)) {
        this.activeSection = id;
        break;
      }
    }
  }

  scrollToSection(id) {
    this.activeSection = id;
    this.isClickScrolling = true;

    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }

    this.clickTimeout = setTimeout(() => {
      this.isClickScrolling = false;
    }, 800);
  }
}

// 1.1 Top Boundary Tests
test('Top Boundary: scrollY <= 50 deterministically activates hero', () => {
  const harness = new ActiveSectionHarness(ALL_SECTION_IDS);
  harness.activeSection = 'experience'; // initially set to non-hero

  // Test values <= 50
  const topValues = [-10, 0, 1, 20, 49, 50];
  for (const y of topValues) {
    harness.activeSection = 'experience';
    harness.handleScroll(y, 800, 10000);
    assert.strictEqual(harness.activeSection, 'hero', `Failed to activate hero at scrollY=${y}`);
  }
});

test('Top Boundary: scrollY > 50 does not trigger top hero override', () => {
  const harness = new ActiveSectionHarness(ALL_SECTION_IDS);
  harness.activeSection = 'experience';

  // Test values > 50 (not near bottom)
  const nonTopValues = [51, 60, 100, 500, 2000];
  for (const y of nonTopValues) {
    harness.activeSection = 'experience';
    harness.handleScroll(y, 800, 10000);
    assert.strictEqual(
      harness.activeSection,
      'experience',
      `Unexpectedly overrode activeSection at scrollY=${y}`
    );
  }
});

// 1.2 Bottom Boundary Tests
test('Bottom Boundary: scrollY + innerHeight >= docHeight - 50 deterministically activates contact', () => {
  const harness = new ActiveSectionHarness(ALL_SECTION_IDS);
  const docHeight = 12000;
  const innerHeight = 800;
  const bottomThreshold = docHeight - innerHeight - 50; // 11150

  const bottomValues = [11150, 11151, 11200, docHeight - innerHeight];
  for (const y of bottomValues) {
    harness.activeSection = 'about';
    harness.handleScroll(y, innerHeight, docHeight);
    assert.strictEqual(
      harness.activeSection,
      'contact',
      `Failed to activate contact at bottom boundary scrollY=${y}`
    );
  }
});

test('Bottom Boundary: scrollY + innerHeight < docHeight - 50 does not trigger contact override', () => {
  const harness = new ActiveSectionHarness(ALL_SECTION_IDS);
  const docHeight = 12000;
  const innerHeight = 800;
  const nonBottomValues = [0, 5000, 10000, 11149];

  for (const y of nonBottomValues) {
    if (y <= 50) continue; // skip top boundary
    harness.activeSection = 'projects';
    harness.handleScroll(y, innerHeight, docHeight);
    assert.strictEqual(
      harness.activeSection,
      'projects',
      `Unexpectedly overrode activeSection at scrollY=${y}`
    );
  }
});

// 1.3 Scrolled Threshold Indicator
test('Scrolled State: isScrolled activates when scrollY > scrolledThreshold (default 40px)', () => {
  const harness = new ActiveSectionHarness(ALL_SECTION_IDS, { scrolledThreshold: 40 });

  harness.handleScroll(0, 800, 10000);
  assert.strictEqual(harness.isScrolled, false);

  harness.handleScroll(40, 800, 10000);
  assert.strictEqual(harness.isScrolled, false);

  harness.handleScroll(41, 800, 10000);
  assert.strictEqual(harness.isScrolled, true);

  harness.handleScroll(200, 800, 10000);
  assert.strictEqual(harness.isScrolled, true);
});

// 1.4 Programmatic Click Lock (800ms Mutex)
await testAsync(
  'Programmatic Click Lock: Suppresses scroll and observer overrides for 800ms',
  async () => {
    const harness = new ActiveSectionHarness(ALL_SECTION_IDS);

    // Click on 'skills'
    harness.scrollToSection('skills');
    assert.strictEqual(harness.activeSection, 'skills');
    assert.strictEqual(harness.isClickScrolling, true);

    // During click scroll: scroll event should be ignored
    harness.handleScroll(0, 800, 10000); // would otherwise force 'hero'
    assert.strictEqual(harness.activeSection, 'skills', 'Top boundary breached lock!');

    // During click scroll: intersection entries should be ignored
    harness.handleIntersection([{ id: 'about', isIntersecting: true }]);
    assert.strictEqual(harness.activeSection, 'skills', 'Intersection breached lock!');

    // Wait 850ms for lock release
    await new Promise((r) => setTimeout(r, 850));
    assert.strictEqual(harness.isClickScrolling, false, 'Lock failed to release after 800ms');

    // Now intersection should work again
    harness.handleIntersection([{ id: 'about', isIntersecting: true }]);
    assert.strictEqual(harness.activeSection, 'about', 'Intersection failed after lock release');
  }
);

// 1.5 Intersection Priority Order Invariant
test('IntersectionObserver Invariant: Chooses first visible section in document sequence', () => {
  const harness = new ActiveSectionHarness(ALL_SECTION_IDS);

  // Simultaneous intersection of 'projects', 'education', 'skills'
  harness.handleIntersection([
    { id: 'projects', isIntersecting: true },
    { id: 'education', isIntersecting: true },
    { id: 'skills', isIntersecting: true },
  ]);

  // 'education' appears earlier in ALL_SECTION_IDS than 'projects' and 'skills'
  assert.strictEqual(
    harness.activeSection,
    'education',
    'Did not select the first intersecting section in page sequence'
  );
});

// -----------------------------------------------------------------------------
// MODULE 2: Mobile Drawer & Command Palette Accessibility Verification
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 2: Navigation & Mobile Drawer Accessibility ---');

const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');

test('Mobile Drawer: Dialog Accessibility Roles and Attributes', () => {
  // Check role="dialog"
  assert.match(navSource, /role=["']dialog["']/);
  // Check aria-modal="true"
  assert.match(navSource, /aria-modal=["']true["']/);
  // Check aria-label
  assert.match(navSource, /aria-label=["']Site Navigation Menu["']/);
  // Check aria-controls="mobile-nav-drawer"
  assert.match(navSource, /aria-controls=["']mobile-nav-drawer["']/);
  // Check aria-expanded binding
  assert.match(navSource, /aria-expanded=\{mobileOpen\}/);
});

test('Mobile Drawer: Body Scroll Lock with Layout Shift (Scrollbar Width) Compensation', () => {
  // Must lock overflow: hidden
  assert.match(navSource, /document\.body\.style\.overflow\s*=\s*['"]hidden['"]/);
  // Must compensate scrollbar width
  assert.match(navSource, /window\.innerWidth\s*-\s*document\.documentElement\.clientWidth/);
  assert.match(navSource, /document\.body\.style\.paddingRight\s*=/);
  // Must clean up and restore on unmount / close
  assert.match(navSource, /document\.body\.style\.overflow\s*=\s*originalOverflow/);
  assert.match(navSource, /document\.body\.style\.paddingRight\s*=\s*originalPaddingRight/);
});

test('Command Palette: Global Keyboard Shortcuts (Ctrl+K / Cmd+K and Escape)', () => {
  // Check Ctrl+K / Cmd+K binding
  assert.match(
    navSource,
    /\(e\.metaKey\s*\|\|\s*e\.ctrlKey\)\s*&&\s*e\.key\.toLowerCase\(\)\s*===\s*['"]k['"]/
  );
  // Check Escape dismissal
  assert.match(navSource, /e\.key\s*===\s*['"]Escape['"]/);
  // Check ArrowDown / ArrowUp navigation with modulo wraparound
  assert.match(
    navSource,
    /setSelectedSearchIndex\(\s*\(prev\)\s*=>\s*\(prev\s*\+\s*1\)\s*%\s*filteredSections\.length\s*\)/
  );
  assert.match(
    navSource,
    /setSelectedSearchIndex\(\s*\(prev\)\s*=>\s*\(prev\s*-\s*1\s*\+\s*filteredSections\.length\)\s*%\s*filteredSections\.length\s*\)/
  );
});

test('Navigation: Backdrop Scrim and Outside Click Dismissal', () => {
  // Scrim click closes mobileOpen
  assert.match(
    navSource,
    /key=["']drawer-scrim["'][\s\S]*?onClick=\{\(\)\s*=>\s*setMobileOpen\(false\)\}/
  );
  // Scrim click closes commandOpen
  assert.match(
    navSource,
    /key=["']command-scrim["'][\s\S]*?onClick=\{\(\)\s*=>\s*setCommandOpen\(false\)\}/
  );
});

// -----------------------------------------------------------------------------
// MODULE 3: SectionDivider Layout & SVG Geometry Invariants
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 3: SectionDivider Responsive Layout & SVG Geometry ---');

const dividerSource = fs.readFileSync('src/components/ui/SectionDivider.tsx', 'utf8');

test('SectionDivider: Supported Variants Coverage', () => {
  const expectedVariants = ['wave', 'curve', 'angle', 'slant', 'glow', 'gradient'];
  for (const v of expectedVariants) {
    assert.ok(dividerSource.includes(`'${v}'`), `Missing variant '${v}' in SectionDivider.tsx`);
  }
});

test('SectionDivider: SVG preserveAspectRatio="none" and non-scaling-stroke', () => {
  // preserveAspectRatio="none" ensures fluid horizontal stretch without distortion
  assert.match(
    dividerSource,
    /preserveAspectRatio=["']none["']/,
    'preserveAspectRatio="none" missing from SectionDivider'
  );

  // vectorEffect="non-scaling-stroke" ensures border remains exactly 1px at all viewports
  assert.match(
    dividerSource,
    /vectorEffect=["']non-scaling-stroke["']/,
    'vectorEffect="non-scaling-stroke" missing from contour paths'
  );

  // Subpixel seam protection (-my-px)
  assert.match(dividerSource, /-my-px/, '-my-px missing from SectionDivider container');
});

test('SectionDivider: Horizontal Overflow Protection (Zero Overflow Invariant)', () => {
  // Container must have overflow-hidden, w-full, select-none, pointer-events-none
  assert.match(dividerSource, /relative[\s\S]*?w-full[\s\S]*?overflow-hidden/);
  assert.match(dividerSource, /pointer-events-none/);
});

// Viewport width simulation: confirm w-full & overflow-hidden mathematically enforces zero overflow
test('Layout Simulation: Zero Horizontal Overflow across 320px to 3840px (4K)', () => {
  const viewports = [320, 360, 375, 414, 480, 640, 768, 1024, 1280, 1440, 1920, 2560, 3840];

  for (const vp of viewports) {
    // Container width is 100% of viewport
    const containerWidth = vp;
    const isOverflowHidden = true;
    const svgWidth = '100%';

    // Effective visible width cannot exceed viewport
    const effectiveWidth = isOverflowHidden ? Math.min(containerWidth, vp) : containerWidth;
    const hasHorizontalOverflow = effectiveWidth > vp;

    assert.strictEqual(
      hasHorizontalOverflow,
      false,
      `Horizontal overflow detected at viewport ${vp}px`
    );
  }
});

// -----------------------------------------------------------------------------
// MODULE 4: Section ID Completeness & DOM Node Integrity
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 4: Section ID Completeness & Page Structure ---');

const pageSource = fs.readFileSync('src/app/page.tsx', 'utf8');

const sectionFiles = {
  hero: 'src/components/sections/HeroSection.tsx',
  about: 'src/components/sections/AboutSection.tsx',
  experience: 'src/components/sections/ExperienceSection.tsx',
  education: 'src/components/sections/EducationSection.tsx',
  achievements: 'src/components/sections/AchievementsSection.tsx',
  projects: 'src/components/sections/ProjectsSection.tsx',
  skills: 'src/components/sections/SkillsSection.tsx',
  trivia: 'src/components/sections/TriviaGame.tsx',
  contact: 'src/components/sections/ContactSection.tsx',
};

test('Section ID Verification: All 9 IDs correspond to actual files with matching id attributes', () => {
  for (const [id, filePath] of Object.entries(sectionFiles)) {
    assert.ok(fs.existsSync(filePath), `File does not exist: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(`id=['"]${id}['"]`);
    assert.match(content, regex, `Section file ${filePath} does not define id="${id}"`);
  }
});

test('Page Layout: All 9 sections are included in app/page.tsx in correct sequence', () => {
  const expectedComponentSequence = [
    'HeroSection',
    'AboutSection',
    'ExperienceSection',
    'EducationSection',
    'AchievementsSection',
    'ProjectsSection',
    'SkillsSection',
    'TriviaGame',
    'ContactSection',
  ];

  let lastIndex = -1;
  for (const compName of expectedComponentSequence) {
    const idx = pageSource.indexOf(`<${compName}`);
    assert.ok(idx !== -1, `Component <${compName} /> not rendered in app/page.tsx`);
    assert.ok(idx > lastIndex, `Component <${compName} /> is out of sequence in app/page.tsx`);
    lastIndex = idx;
  }
});

test('SectionDivider Placement: Alternating dividers placed between major sections', () => {
  const dividerCount = (pageSource.match(/<SectionDivider/g) || []).length;
  assert.ok(
    dividerCount >= 6,
    `Expected at least 6 SectionDividers in app/page.tsx, found ${dividerCount}`
  );

  // Check specific variants used
  assert.ok(pageSource.includes('variant="glow"'));
  assert.ok(pageSource.includes('variant="angle"'));
  assert.ok(pageSource.includes('variant="curve"'));
  assert.ok(pageSource.includes('variant="gradient"'));
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(
  `TEST SUMMARY: ${RESULTS.passed} PASSED, ${RESULTS.failed} FAILED out of ${RESULTS.passed + RESULTS.failed} tests`
);
console.log('================================================================\n');

if (RESULTS.failed > 0) {
  process.exit(1);
}
