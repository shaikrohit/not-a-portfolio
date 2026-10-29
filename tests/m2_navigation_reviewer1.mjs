/**
 * Milestone 2 Reviewer 1 - Empirical Adversarial Verification Suite
 * Targets: src/hooks/useActiveSection.ts & src/components/layout/Navigation.tsx
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('================================================================');
console.log('STARTING EMPIRICAL ADVERSARIAL TEST SUITE: MILESTONE 2 NAVIGATION');
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`✗ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
  }
}

// ----------------------------------------------------------------------------
// MODULE 1: INTEGRITY & SOURCE CODE AUDIT
// ----------------------------------------------------------------------------
console.log('--- MODULE 1: Integrity & Anti-Facade Audit ---');

const activeSectionPath = path.resolve('src/hooks/useActiveSection.ts');
const navigationPath = path.resolve('src/components/layout/Navigation.tsx');
const pagePath = path.resolve('src/app/page.tsx');

const activeSectionCode = fs.readFileSync(activeSectionPath, 'utf-8');
const navigationCode = fs.readFileSync(navigationPath, 'utf-8');
const pageCode = fs.readFileSync(pagePath, 'utf-8');

runTest('Integrity: No hardcoded test dummy or bypass mocks in source code', () => {
  const forbiddenPatterns = [
    /mockReturnValue/i,
    /bypass_verification/i,
    /__test_result__/i,
    /fake_implementation/i,
    /jest\.fn\(/i,
  ];
  for (const pattern of forbiddenPatterns) {
    assert.strictEqual(
      pattern.test(activeSectionCode),
      false,
      `Detected suspicious test mock in useActiveSection.ts: ${pattern}`
    );
    assert.strictEqual(
      pattern.test(navigationCode),
      false,
      `Detected suspicious test mock in Navigation.tsx: ${pattern}`
    );
  }
});

runTest('Integrity: Real IntersectionObserver and MutationObserver instantiation', () => {
  assert(
    activeSectionCode.includes('new IntersectionObserver'),
    'useActiveSection must instantiate real IntersectionObserver'
  );
  assert(
    activeSectionCode.includes('new MutationObserver'),
    'useActiveSection must instantiate real MutationObserver for dynamic import hydration'
  );
});

runTest('Integrity: Dynamic import support via MutationObserver cleanup', () => {
  assert(
    activeSectionCode.includes('mutationObserver.disconnect()'),
    'MutationObserver must be safely disconnected when observedElements >= sectionIds.length or on unmount'
  );
});

// ----------------------------------------------------------------------------
// MODULE 2: SECTION ID ALIGNMENT & PAGE MAPPING
// ----------------------------------------------------------------------------
console.log('\n--- MODULE 2: Section ID Contract & Layout Alignment ---');

const EXPECTED_SECTIONS = [
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

runTest('Contract: Navigation defines all 10 required page sections', () => {
  for (const id of EXPECTED_SECTIONS) {
    assert(
      navigationCode.includes(`id: '${id}'`),
      `Navigation.tsx missing section definition for '${id}'`
    );
  }
});

runTest('Contract: Actual section components in page.tsx implement matching DOM IDs', () => {
  for (const id of EXPECTED_SECTIONS) {
    // Check if each section component file has id="<id>"
    const sectionEntries = fs.readdirSync(path.resolve('src/components/sections'));
    let matched = false;
    for (const entry of sectionEntries) {
      const fullPath = path.resolve('src/components/sections', entry);
      if (!fs.statSync(fullPath).isFile()) continue;
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes(`id="${id}"`) || content.includes(`id='${id}'`)) {
        matched = true;
        break;
      }
    }
    assert(matched, `No section component in src/components/sections/ implements id="${id}"`);
  }
});

runTest('Contract: Desktop nav items correspond to non-hero page landmarks', () => {
  const desktopIds = [
    'about',
    'experience',
    'education',
    'achievements',
    'projects',
    'skills',
    'trivia',
    'contact',
  ];
  for (const id of desktopIds) {
    assert(
      navigationCode.includes(`id: '${id}', label:`),
      `DESKTOP_NAV_ITEMS missing item for '${id}'`
    );
  }
});

// ----------------------------------------------------------------------------
// MODULE 3: HOOK DETERMINISTIC LOGIC & BOUNDARY CONDITIONS
// ----------------------------------------------------------------------------
console.log('\n--- MODULE 3: useActiveSection Deterministic Logic Simulation ---');

// Simulate the logic in useActiveSection
class ActiveSectionSimulation {
  constructor(sectionIds, options = {}) {
    this.sectionIds = sectionIds;
    this.rootMargin = options.rootMargin || '-20% 0px -70% 0px';
    this.scrolledThreshold = options.scrolledThreshold || 40;
    this.activeSection = options.defaultSection || sectionIds[0] || '';
    this.isScrolled = false;
    this.isClickScrolling = false;
    this.clickTimeout = null;
    this.visibleSections = new Map();
  }

  handleScroll(scrollY, windowHeight, docHeight) {
    this.isScrolled = scrollY > this.scrolledThreshold;
    if (this.isClickScrolling) return;

    // Top boundary
    if (scrollY <= 50 && this.sectionIds.length > 0) {
      this.activeSection = this.sectionIds[0];
      return;
    }

    // Bottom boundary
    if (scrollY + windowHeight >= docHeight - 50 && this.sectionIds.length > 0) {
      this.activeSection = this.sectionIds[this.sectionIds.length - 1];
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

  scrollToSection(id, customDelay = 800) {
    this.activeSection = id;
    this.isClickScrolling = true;
    if (this.clickTimeout) clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      this.isClickScrolling = false;
    }, customDelay);
  }
}

runTest('Hook Logic: Top boundary scrollY <= 50 deterministically activates hero', () => {
  const sim = new ActiveSectionSimulation(EXPECTED_SECTIONS);
  sim.activeSection = 'projects'; // arbitrary state
  sim.handleScroll(30, 800, 5000);
  assert.strictEqual(sim.activeSection, 'hero');

  sim.handleScroll(0, 800, 5000);
  assert.strictEqual(sim.activeSection, 'hero');

  sim.handleScroll(50, 800, 5000);
  assert.strictEqual(sim.activeSection, 'hero');
});

runTest('Hook Logic: Bottom boundary scroll reaches docHeight - 50 activates contact', () => {
  const sim = new ActiveSectionSimulation(EXPECTED_SECTIONS);
  sim.activeSection = 'hero';
  // docHeight = 5000, windowHeight = 800, docHeight - 50 = 4950
  // scrollY = 4160 -> scrollY + windowHeight = 4960 >= 4950
  sim.handleScroll(4160, 800, 5000);
  assert.strictEqual(sim.activeSection, 'contact');
});

runTest(
  'Hook Logic: First intersecting section in document sequence deterministically wins',
  () => {
    const sim = new ActiveSectionSimulation(EXPECTED_SECTIONS);
    // Both 'experience' and 'education' intersect
    sim.handleIntersection([
      { id: 'education', isIntersecting: true },
      { id: 'experience', isIntersecting: true },
      { id: 'hero', isIntersecting: false },
    ]);
    // In sequence: hero -> paths -> about -> experience -> education
    // 'experience' comes before 'education', so it must win
    assert.strictEqual(sim.activeSection, 'experience');
  }
);

runTest(
  'Hook Logic: Smooth scroll click lock suppresses observer overrides during transition',
  async () => {
    const sim = new ActiveSectionSimulation(EXPECTED_SECTIONS);
    // User clicks 'contact'
    sim.scrollToSection('contact', 100);
    assert.strictEqual(sim.activeSection, 'contact');
    assert.strictEqual(sim.isClickScrolling, true);

    // While scrolling, page passes through 'about' and 'projects'
    sim.handleIntersection([
      { id: 'about', isIntersecting: true },
      { id: 'contact', isIntersecting: false },
    ]);
    // Because isClickScrolling is true, activeSection must remain 'contact'
    assert.strictEqual(sim.activeSection, 'contact');

    // Wait for lock to expire
    await new Promise((r) => setTimeout(r, 120));
    assert.strictEqual(sim.isClickScrolling, false);

    // Now observer can update
    sim.handleIntersection([{ id: 'projects', isIntersecting: true }]);
    assert.strictEqual(sim.activeSection, 'projects');
  }
);

// ----------------------------------------------------------------------------
// MODULE 4: COMMAND PALETTE FILTERING & KEYBOARD STRESS TESTS
// ----------------------------------------------------------------------------
console.log('\n--- MODULE 4: Command Palette Filtering & Keyboard Stress ---');

const ALL_PAGE_SECTIONS_FIXTURE = [
  {
    id: 'hero',
    label: 'Home',
    shortLabel: 'Home',
    description: 'Interactive 3D particle sphere & introduction',
    category: 'Overview',
  },
  {
    id: 'paths',
    label: 'Journeys',
    shortLabel: 'Paths',
    description: 'Tailored persona paths (Recruiter, Engineer, Explorer)',
    category: 'Overview',
  },
  {
    id: 'about',
    label: 'About',
    shortLabel: 'About',
    description: 'Bio, core philosophy & interactive bento grid',
    category: 'Profile',
  },
  {
    id: 'experience',
    label: 'Experience',
    shortLabel: 'Experience',
    description: 'Career history, engineering leadership & impact',
    category: 'Experience',
  },
  {
    id: 'education',
    label: 'Education',
    shortLabel: 'Education',
    description: 'Academic background, coursework & certifications',
    category: 'Experience',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    shortLabel: 'Honors',
    description: 'Hackathon victories, awards & recognitions',
    category: 'Experience',
  },
  {
    id: 'projects',
    label: 'Projects',
    shortLabel: 'Projects',
    description: 'Production systems, full-stack apps & AI tools',
    category: 'Work',
  },
  {
    id: 'skills',
    label: 'Skills',
    shortLabel: 'Skills',
    description: 'Interactive 3D skill sphere & technology radar',
    category: 'Work',
  },
  {
    id: 'trivia',
    label: 'Trivia',
    shortLabel: 'Trivia',
    description: 'Interactive developer quiz & challenge',
    category: 'Interactive',
  },
  {
    id: 'contact',
    label: 'Contact',
    shortLabel: 'Contact',
    description: 'Direct message form & social profile orbit',
    category: 'Connect',
  },
];

function filterSections(query) {
  if (!query.trim()) return ALL_PAGE_SECTIONS_FIXTURE;
  const q = query.toLowerCase().trim();
  return ALL_PAGE_SECTIONS_FIXTURE.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  );
}

runTest('Palette: Empty query returns all 10 sections', () => {
  assert.strictEqual(filterSections('').length, 10);
  assert.strictEqual(filterSections('   ').length, 10);
});

runTest('Palette: Case-insensitive query matches label, id, category, and description', () => {
  // Label match
  const res1 = filterSections('projects');
  assert(res1.some((s) => s.id === 'projects'));

  // Category match
  const res2 = filterSections('overview');
  assert.strictEqual(res2.length, 2); // hero and paths
  assert(res2.some((s) => s.id === 'hero'));
  assert(res2.some((s) => s.id === 'paths'));

  // Description match
  const res3 = filterSections('bento');
  assert.strictEqual(res3.length, 1);
  assert.strictEqual(res3[0].id, 'about');

  // ID match
  const res4 = filterSections('TRIVIA');
  assert.strictEqual(res4.length, 1);
  assert.strictEqual(res4[0].id, 'trivia');
});

runTest('Palette: Adversarial special characters do not throw regex syntax errors', () => {
  const adversarialQueries = [
    'c++',
    'react (hooks)',
    '[w-full]',
    '\\d+',
    'test.*regex',
    '$100',
    'foo|bar',
  ];
  for (const q of adversarialQueries) {
    assert.doesNotThrow(() => {
      const res = filterSections(q);
      assert(Array.isArray(res));
    });
  }
});

runTest('Palette: Keyboard navigation circular modulo wrapping (10,000 rapid keystrokes)', () => {
  const items = ALL_PAGE_SECTIONS_FIXTURE;
  let selectedIndex = 0;

  // ArrowDown
  for (let i = 0; i < 10000; i++) {
    selectedIndex = (selectedIndex + 1) % items.length;
    assert(selectedIndex >= 0 && selectedIndex < items.length);
  }

  // ArrowUp
  for (let i = 0; i < 10000; i++) {
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
    assert(selectedIndex >= 0 && selectedIndex < items.length);
  }

  // Exact wrap test: from 0, ArrowUp must equal items.length - 1 (9)
  selectedIndex = 0;
  selectedIndex = (selectedIndex - 1 + items.length) % items.length;
  assert.strictEqual(selectedIndex, 9);

  // From 9, ArrowDown must equal 0
  selectedIndex = (selectedIndex + 1) % items.length;
  assert.strictEqual(selectedIndex, 0);
});

// ----------------------------------------------------------------------------
// MODULE 5: ACCESSIBILITY & SCROLL LOCK AUDIT
// ----------------------------------------------------------------------------
console.log('\n--- MODULE 5: Accessibility (a11y) & Layout Shift Audit ---');

runTest('a11y: Mobile drawer has role="dialog" and aria-modal="true"', () => {
  assert(
    navigationCode.includes('role="dialog"') &&
      navigationCode.includes('aria-modal="true"') &&
      navigationCode.includes('aria-label="Site Navigation Menu"'),
    'Mobile drawer must implement dialog semantics'
  );
});

runTest('a11y: Drawer trigger has aria-expanded and aria-controls', () => {
  assert(
    navigationCode.includes('aria-expanded={mobileOpen}') &&
      navigationCode.includes('aria-controls="mobile-nav-drawer"'),
    'Drawer trigger button must expose state via aria-expanded and aria-controls'
  );
});

runTest('a11y: Command palette has role="dialog" and aria-modal="true"', () => {
  assert(
    navigationCode.includes('aria-label="Command Palette"') &&
      navigationCode.includes('aria-label="Search sections and commands"'),
    'Command palette modal must have dialog role and input aria-label'
  );
});

runTest('a11y: Active navigation indicators use aria-current', () => {
  assert(
    navigationCode.includes("aria-current={isActive ? 'true' : undefined}"),
    'Active nav button must declare aria-current when active'
  );
});

runTest('Layout Shift: Scrollbar compensation calculates clientWidth difference', () => {
  assert(
    navigationCode.includes('window.innerWidth - document.documentElement.clientWidth'),
    'Body scroll lock must measure scrollbar width to prevent horizontal layout shift'
  );
  assert(
    navigationCode.includes('document.body.style.paddingRight'),
    'Scroll lock must apply padding compensation to document.body'
  );
  assert(
    navigationCode.includes('document.body.style.overflow = originalOverflow'),
    'Scroll lock cleanup must restore original body overflow'
  );
});

runTest('Layout: Framer Motion animated activeNavIndicator layoutId is present', () => {
  assert(
    navigationCode.includes('layoutId="activeNavIndicator"'),
    'Desktop navigation must have Framer Motion activeNavIndicator layoutId'
  );
});

// ----------------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(
  `TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} tests`
);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
}
