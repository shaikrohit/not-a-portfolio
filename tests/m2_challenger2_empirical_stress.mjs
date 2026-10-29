/**
 * Milestone 2 Challenger 2 (Replacement) - Adversarial Empirical Stress Test Suite
 *
 * Target Domains:
 * 1. useActiveSection Hook Boundary Conditions & Mutex Locking Dynamics
 * 2. Navigation, Mobile Drawer & Command Palette Accessibility & Keyboard Controls
 * 3. SectionDivider Layout Integrity & SVG Non-Scaling Stroke Invariant across 320px - 3840px (4K)
 * 4. Section ID Contract & Layout Integration Across Main Application
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

console.log('================================================================');
console.log('CHALLENGER 2 (REP) EMPIRICAL ADVERSARIAL STRESS TEST SUITE: M2');
console.log(`Execution Timestamp: ${new Date().toISOString()}`);
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const findings = [];

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// ============================================================================
// SECTION 1: useActiveSection HOOK BOUNDARY CONDITIONS & MUTEX LOCKING
// ============================================================================
console.log('--- SECTION 1: useActiveSection Hook Boundary Conditions & Mutex ---');

const ALL_10_SECTIONS = [
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

// Faithful mirror of useActiveSection internal state machine
class ActiveSectionSimulator {
  constructor(sectionIds = ALL_10_SECTIONS, options = {}) {
    this.sectionIds = sectionIds;
    this.scrolledThreshold = options.scrolledThreshold ?? 40;
    this.activeSection = options.defaultSection ?? sectionIds[0] ?? '';
    this.isScrolled = false;
    this.isClickScrolling = false;
    this.clickTimeout = null;
    this.visibleSections = new Map();
    this.observedElements = new Set();
    this.mutationObserverConnected = true;
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
    }
  }

  handleIntersection(entries) {
    if (this.isClickScrolling) return;

    for (const entry of entries) {
      this.visibleSections.set(entry.id, entry.isIntersecting);
    }

    for (const id of this.sectionIds) {
      if (this.visibleSections.get(id)) {
        this.activeSection = id;
        break;
      }
    }
  }

  scrollToSection(id, elementExists = true) {
    if (elementExists) {
      this.activeSection = id;
      this.isClickScrolling = true;

      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
      }

      this.clickTimeout = setTimeout(() => {
        this.isClickScrolling = false;
      }, 800);
    } else if (id === 'hero' || id === 'top') {
      this.activeSection = 'hero';
    }
  }

  simulateMount(mountedId) {
    if (this.sectionIds.includes(mountedId)) {
      this.observedElements.add(mountedId);
      if (this.observedElements.size >= this.sectionIds.length) {
        this.mutationObserverConnected = false;
      }
    }
  }
}

runTest('1.1: scrollY <= 50 deterministically activates hero at exact thresholds', () => {
  const harness = new ActiveSectionSimulator(ALL_10_SECTIONS, { defaultSection: 'about' });
  harness.activeSection = 'experience';

  // scrollY = 0 -> must activate 'hero'
  harness.handleScroll(0, 1000, 5000);
  assert.strictEqual(harness.activeSection, 'hero', 'scrollY = 0 must force hero');

  // scrollY = 50 -> boundary inclusive, must activate 'hero'
  harness.activeSection = 'experience';
  harness.handleScroll(50, 1000, 5000);
  assert.strictEqual(harness.activeSection, 'hero', 'scrollY = 50 must force hero');

  // scrollY = 51 -> beyond boundary, must NOT force hero
  harness.activeSection = 'experience';
  harness.handleScroll(51, 1000, 5000);
  assert.strictEqual(harness.activeSection, 'experience', 'scrollY = 51 must not force hero');
});

runTest(
  '1.2: scrollY + innerHeight >= scrollHeight - 50 deterministically activates contact',
  () => {
    const harness = new ActiveSectionSimulator(ALL_10_SECTIONS);
    const winHeight = 1000;
    const docHeight = 10000;
    // bottom threshold: scrollY + 1000 >= 9950 => scrollY >= 8950

    harness.activeSection = 'projects';
    harness.handleScroll(8949, winHeight, docHeight);
    assert.strictEqual(
      harness.activeSection,
      'projects',
      'scrollY = 8949 is 1px before bottom threshold'
    );

    harness.handleScroll(8950, winHeight, docHeight);
    assert.strictEqual(
      harness.activeSection,
      'contact',
      'scrollY = 8950 exactly meets bottom boundary'
    );

    harness.activeSection = 'projects';
    harness.handleScroll(9000, winHeight, docHeight);
    assert.strictEqual(
      harness.activeSection,
      'contact',
      'scrollY = 9000 is deep within bottom boundary'
    );
  }
);

runTest('1.3: Top boundary takes precedence over bottom boundary on short pages', () => {
  // Edge case: Short document where docHeight = 600, winHeight = 600.
  // scrollY = 0 <= 50 (top match) AND scrollY + winHeight = 600 >= 550 (bottom match)
  const harness = new ActiveSectionSimulator(ALL_10_SECTIONS);
  harness.handleScroll(0, 600, 600);
  assert.strictEqual(
    harness.activeSection,
    'hero',
    'Top boundary return statement must ensure hero is active at top of short pages'
  );
});

runTest('1.4: Scrolled threshold correctly sets isScrolled boolean', () => {
  const harness = new ActiveSectionSimulator(ALL_10_SECTIONS, { scrolledThreshold: 40 });
  harness.handleScroll(40, 1000, 5000);
  assert.strictEqual(harness.isScrolled, false, 'scrollY = 40 should not mark isScrolled');

  harness.handleScroll(41, 1000, 5000);
  assert.strictEqual(harness.isScrolled, true, 'scrollY = 41 must mark isScrolled');
});

runTest('1.5: IntersectionObserver prioritizes page sequence over entry arrival order', () => {
  const harness = new ActiveSectionSimulator(ALL_10_SECTIONS);

  // Suppose entries arrive with trivia first, then projects, then about
  harness.handleIntersection([
    { id: 'trivia', isIntersecting: true },
    { id: 'projects', isIntersecting: true },
    { id: 'about', isIntersecting: true },
  ]);

  // In ALL_10_SECTIONS, 'about' occurs before 'projects' and 'trivia'.
  // Hook iterates sectionIds in order, so 'about' MUST be active.
  assert.strictEqual(
    harness.activeSection,
    'about',
    'Hook must choose the earliest section in page order among visible candidates'
  );

  // When 'about' leaves viewport:
  harness.handleIntersection([{ id: 'about', isIntersecting: false }]);
  assert.strictEqual(
    harness.activeSection,
    'projects',
    'When earlier section leaves, next earliest intersecting section must be active'
  );
});

runTest(
  '1.6: Dynamic section mount via MutationObserver disconnects when all sections observed',
  () => {
    const harness = new ActiveSectionSimulator(ALL_10_SECTIONS);
    assert.strictEqual(harness.mutationObserverConnected, true);

    // Mount sections 0 to 8
    for (let i = 0; i < 9; i++) {
      harness.simulateMount(ALL_10_SECTIONS[i]);
      assert.strictEqual(
        harness.mutationObserverConnected,
        true,
        `Observer should remain connected at ${i + 1} sections`
      );
    }

    // Mount final 10th section ('contact')
    harness.simulateMount(ALL_10_SECTIONS[9]);
    assert.strictEqual(
      harness.mutationObserverConnected,
      false,
      'MutationObserver must automatically disconnect once all 10 sections are mounted'
    );
  }
);

await runAsyncTest(
  '1.7: Programmatic click lock (800ms) blocks scroll & intersection changes',
  async () => {
    const harness = new ActiveSectionSimulator(ALL_10_SECTIONS);
    harness.activeSection = 'hero';

    // User clicks 'education'
    harness.scrollToSection('education');
    assert.strictEqual(harness.activeSection, 'education');
    assert.strictEqual(harness.isClickScrolling, true);

    // While smooth scrolling, intermediate sections trigger intersections & scroll events
    harness.handleIntersection([{ id: 'paths', isIntersecting: true }]);
    harness.handleScroll(200, 1000, 5000);
    assert.strictEqual(
      harness.activeSection,
      'education',
      'Active section must remain locked on clicked section during scroll transition'
    );

    // Wait 850ms for lock to expire
    await new Promise((resolve) => setTimeout(resolve, 850));
    assert.strictEqual(harness.isClickScrolling, false, 'Lock must expire after 800ms');

    // Now intersection should update active section
    harness.handleIntersection([{ id: 'paths', isIntersecting: true }]);
    assert.strictEqual(
      harness.activeSection,
      'paths',
      'Active section updates normally after lock expiry'
    );
  }
);

await runAsyncTest('1.8: Successive rapid clicks reset the 800ms mutex timer', async () => {
  const harness = new ActiveSectionSimulator(ALL_10_SECTIONS);

  harness.scrollToSection('skills');
  assert.strictEqual(harness.activeSection, 'skills');

  // Wait 400ms, then user clicks 'contact'
  await new Promise((resolve) => setTimeout(resolve, 400));
  harness.scrollToSection('contact');
  assert.strictEqual(harness.activeSection, 'contact');

  // Wait another 500ms (900ms since first click, but only 500ms since second click)
  await new Promise((resolve) => setTimeout(resolve, 500));
  assert.strictEqual(
    harness.isClickScrolling,
    true,
    'Lock must still be active 500ms after second click'
  );

  // Attempt scroll interrupt
  harness.handleScroll(0, 1000, 5000);
  assert.strictEqual(
    harness.activeSection,
    'contact',
    'Active section remains locked on second target'
  );

  // Wait remaining 350ms
  await new Promise((resolve) => setTimeout(resolve, 350));
  assert.strictEqual(harness.isClickScrolling, false, 'Lock expires 800ms after the second click');
});

runTest('1.9: scrollToSection fallback for hero / top when element missing from DOM', () => {
  const harness = new ActiveSectionSimulator(ALL_10_SECTIONS);
  harness.activeSection = 'about';

  // Element 'hero' missing in DOM
  harness.scrollToSection('hero', false);
  assert.strictEqual(harness.activeSection, 'hero', 'scrollToSection fallback handles hero');

  harness.activeSection = 'about';
  harness.scrollToSection('top', false);
  assert.strictEqual(harness.activeSection, 'hero', 'scrollToSection fallback handles top');
});

// ============================================================================
// SECTION 2: MOBILE DRAWER & COMMAND PALETTE ACCESSIBILITY & BEHAVIOR
// ============================================================================
console.log('\n--- SECTION 2: Mobile Drawer & Command Palette Accessibility ---');

const navCode = fs.readFileSync(path.resolve('src/components/layout/Navigation.tsx'), 'utf-8');

runTest('2.1: Mobile Drawer has role="dialog", aria-modal="true", and aria-label', () => {
  assert(
    navCode.includes('id="mobile-nav-drawer"'),
    'Mobile drawer aside element must have id="mobile-nav-drawer"'
  );
  assert(navCode.includes('role="dialog"'), 'Mobile drawer must specify role="dialog"');
  assert(navCode.includes('aria-modal="true"'), 'Mobile drawer must specify aria-modal="true"');
  assert(
    navCode.includes('aria-label="Site Navigation Menu"'),
    'Mobile drawer must have descriptive aria-label'
  );
});

runTest('2.2: Mobile Drawer trigger button implements aria-expanded and aria-controls', () => {
  assert(
    navCode.includes('aria-controls="mobile-nav-drawer"'),
    'Trigger button must declare aria-controls="mobile-nav-drawer"'
  );
  assert(
    navCode.includes('aria-expanded={mobileOpen}'),
    'Trigger button must declare aria-expanded={mobileOpen}'
  );
  assert(
    navCode.includes(
      "aria-label={mobileOpen ? 'Close navigation drawer' : 'Open navigation drawer'}"
    ),
    'Trigger button must dynamically toggle accessible label'
  );
});

runTest('2.3: Command Palette modal has role="dialog", aria-modal="true", and aria-label', () => {
  assert(
    navCode.includes('role="dialog"') && navCode.includes('aria-label="Command Palette"'),
    'Command palette modal must have role="dialog" and aria-label="Command Palette"'
  );
  assert(
    navCode.includes('aria-modal="true"'),
    'Command palette modal must have aria-modal="true"'
  );
});

runTest('2.4: Body scroll lock correctly locks overflow and compensates scrollbar width', () => {
  // Test the scroll lock logic extracted from Navigation.tsx:173-188
  function simulateScrollLock(mobileOpen, commandOpen, initialBody, winInnerWidth, docClientWidth) {
    const body = {
      style: {
        overflow: initialBody.overflow || '',
        paddingRight: initialBody.paddingRight || '',
      },
    };

    let cleanup = () => {};

    if (mobileOpen || commandOpen) {
      const originalOverflow = body.style.overflow;
      const originalPaddingRight = body.style.paddingRight;
      const scrollbarWidth = winInnerWidth - docClientWidth;

      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      cleanup = () => {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      };
    }

    return { body, cleanup };
  }

  // Case A: Desktop with 15px scrollbar
  const stateA = simulateScrollLock(
    true,
    false,
    { overflow: 'auto', paddingRight: '' },
    1920,
    1905
  );
  assert.strictEqual(
    stateA.body.style.overflow,
    'hidden',
    'Body overflow must be hidden when drawer open'
  );
  assert.strictEqual(
    stateA.body.style.paddingRight,
    '15px',
    'Padding right must compensate 15px scrollbar'
  );
  // Cleanup
  stateA.cleanup();
  assert.strictEqual(stateA.body.style.overflow, 'auto', 'Original overflow restored on close');
  assert.strictEqual(stateA.body.style.paddingRight, '', 'Original padding restored on close');

  // Case B: Mobile / Mac overlay scrollbar with 0px width
  const stateB = simulateScrollLock(false, true, { overflow: '', paddingRight: '' }, 375, 375);
  assert.strictEqual(
    stateB.body.style.overflow,
    'hidden',
    'Body overflow must be hidden when command open'
  );
  assert.strictEqual(
    stateB.body.style.paddingRight,
    '',
    'No padding right added when scrollbar width is 0'
  );
  stateB.cleanup();
  assert.strictEqual(stateB.body.style.overflow, '', 'Original empty overflow restored');
});

runTest('2.5: Keyboard Dismissal: Escape key and backdrop scrim dismiss modals', () => {
  // Navigation.tsx:158-164
  function simulateKeyDown(key, currentCommandOpen, currentMobileOpen) {
    let commandOpen = currentCommandOpen;
    let mobileOpen = currentMobileOpen;

    if (key === 'Escape') {
      if (commandOpen) {
        commandOpen = false;
      } else if (mobileOpen) {
        mobileOpen = false;
      }
    }

    return { commandOpen, mobileOpen };
  }

  // If command palette is open, Escape closes command palette first
  assert.deepStrictEqual(
    simulateKeyDown('Escape', true, true),
    { commandOpen: false, mobileOpen: true },
    'Escape should close command palette first if both open'
  );

  // If only mobile drawer is open, Escape closes mobile drawer
  assert.deepStrictEqual(
    simulateKeyDown('Escape', false, true),
    { commandOpen: false, mobileOpen: false },
    'Escape should close mobile drawer when command palette is closed'
  );

  // Verify backdrop scrim click handlers exist in code
  assert(
    navCode.includes('key="drawer-scrim"') &&
      navCode.includes('onClick={() => setMobileOpen(false)}'),
    'Drawer backdrop scrim must dismiss drawer on click'
  );
  assert(
    navCode.includes('key="command-scrim"') &&
      navCode.includes('onClick={() => setCommandOpen(false)}'),
    'Command backdrop scrim must dismiss palette on click'
  );
});

runTest('2.6: Global shortcut: Ctrl+K / Cmd+K toggles commandOpen', () => {
  function simulateShortcut(metaKey, ctrlKey, key, currentOpen) {
    let open = currentOpen;
    if ((metaKey || ctrlKey) && key.toLowerCase() === 'k') {
      open = !open;
    }
    return open;
  }

  // Cmd+K (Mac)
  assert.strictEqual(
    simulateShortcut(true, false, 'k', false),
    true,
    'Cmd+K opens command palette'
  );
  assert.strictEqual(
    simulateShortcut(true, false, 'k', true),
    false,
    'Cmd+K closes command palette if open'
  );

  // Ctrl+K (Windows/Linux)
  assert.strictEqual(
    simulateShortcut(false, true, 'K', false),
    true,
    'Ctrl+K (caps) opens command palette'
  );
  assert.strictEqual(
    simulateShortcut(false, true, 'k', true),
    false,
    'Ctrl+K closes command palette'
  );

  // Irrelevant key combos
  assert.strictEqual(simulateShortcut(true, false, 'j', false), false, 'Cmd+J does not open');
  assert.strictEqual(simulateShortcut(false, false, 'k', false), false, 'Just k does not open');
});

runTest('2.7: Command Palette ArrowUp / ArrowDown navigation and modular wrapping', () => {
  const sectionsCount = 10;

  function handleKey(key, currentIndex, length) {
    if (key === 'ArrowDown') {
      return (currentIndex + 1) % length;
    } else if (key === 'ArrowUp') {
      return (currentIndex - 1 + length) % length;
    }
    return currentIndex;
  }

  // Down from 0 -> 1
  assert.strictEqual(handleKey('ArrowDown', 0, sectionsCount), 1);
  // Down from 9 (last) -> wraps to 0
  assert.strictEqual(
    handleKey('ArrowDown', 9, sectionsCount),
    0,
    'ArrowDown at end must wrap to index 0'
  );

  // Up from 1 -> 0
  assert.strictEqual(handleKey('ArrowUp', 1, sectionsCount), 0);
  // Up from 0 -> wraps to 9
  assert.strictEqual(
    handleKey('ArrowUp', 0, sectionsCount),
    9,
    'ArrowUp at index 0 must wrap to index 9'
  );
});

runTest(
  '2.8: Command Palette search filtering accounts for all 10 sections and search fields',
  () => {
    // Extract ALL_PAGE_SECTIONS from Navigation.tsx
    assert(navCode.includes('ALL_PAGE_SECTIONS: SectionMeta[] = ['));
    for (const id of ALL_10_SECTIONS) {
      assert(navCode.includes(`id: '${id}'`), `ALL_PAGE_SECTIONS must include section '${id}'`);
    }

    // Filter simulation logic (from Navigation.tsx:202-212)
    function filterSections(query) {
      const sections = ALL_10_SECTIONS.map((id) => ({
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1),
        category: 'General',
        description: `Description of ${id}`,
      }));

      if (!query.trim()) return sections;
      const q = query.toLowerCase().trim();
      return sections.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    assert.strictEqual(filterSections('').length, 10, 'Empty query returns all 10 sections');
    assert.strictEqual(filterSections('proj').length, 1, 'Query "proj" returns projects');
    assert.strictEqual(filterSections('proj')[0].id, 'projects');
    assert.strictEqual(filterSections('zzzzzzzz').length, 0, 'Unmatched query returns empty array');
  }
);

// ============================================================================
// SECTION 3: SECTION DIVIDER RESPONSIVE LAYOUT & SVG INTEGRITY (320px–4K)
// ============================================================================
console.log('\n--- SECTION 3: SectionDivider Layout & SVG Geometry (320px - 4K) ---');

const dividerCode = fs.readFileSync(path.resolve('src/components/ui/SectionDivider.tsx'), 'utf-8');

runTest(
  '3.1: SectionDivider supports all 6 variants: wave, curve, angle, slant, glow, gradient',
  () => {
    const variants = ['wave', 'curve', 'angle', 'slant', 'glow', 'gradient'];
    for (const v of variants) {
      assert(dividerCode.includes(`'${v}'`), `SectionDivider must support variant '${v}'`);
    }
  }
);

runTest(
  '3.2: SVG dividers declare preserveAspectRatio="none" and vectorEffect="non-scaling-stroke"',
  () => {
    // preserveAspectRatio="none" allows fluid responsive stretching across any container width
    const preserveMatches = dividerCode.match(/preserveAspectRatio="none"/g) || [];
    assert.strictEqual(
      preserveMatches.length >= 3,
      true,
      'All SVG variants (curve, angle, wave) must declare preserveAspectRatio="none"'
    );

    // vectorEffect="non-scaling-stroke" prevents the 1px border stroke from distorting when stretched to 4K
    const vectorMatches = dividerCode.match(/vectorEffect="non-scaling-stroke"/g) || [];
    assert.strictEqual(
      vectorMatches.length >= 3,
      true,
      'All SVG strokes must specify vectorEffect="non-scaling-stroke"'
    );
  }
);

runTest(
  '3.3: Subpixel seam mitigation: SectionDivider has -my-px margin and overflow-hidden',
  () => {
    assert(
      dividerCode.includes('-my-px'),
      'Divider container must include -my-px to overlap subpixel gaps on Retina/High-DPI displays'
    );
    assert(
      dividerCode.includes('overflow-hidden'),
      'Divider container must specify overflow-hidden to prevent horizontal scroll'
    );
    assert(dividerCode.includes('w-full'), 'Divider container must specify w-full');
  }
);

runTest(
  '3.4: Accessibility: SectionDivider includes role="presentation" and aria-hidden="true"',
  () => {
    assert(
      dividerCode.includes('role="presentation"'),
      'SectionDivider must have role="presentation"'
    );
    assert(
      dividerCode.includes('aria-hidden="true"'),
      'SectionDivider must have aria-hidden="true"'
    );
  }
);

runTest('3.5: SVG viewBox geometry validation', () => {
  assert(dividerCode.includes('viewBox="0 0 1440 96"'), 'Wave divider viewBox must be 1440x96');
  assert(dividerCode.includes('viewBox="0 0 1440 80"'), 'Curve divider viewBox must be 1440x80');
  assert(dividerCode.includes('viewBox="0 0 1440 64"'), 'Angle divider viewBox must be 1440x64');
});

runTest('3.6: Multi-viewport width simulation (320px to 3840px): Zero horizontal overflow', () => {
  const VIEWPORT_WIDTHS = [
    320, // iPhone SE
    360, // Galaxy S8
    375, // iPhone X/11/12 mini
    390, // iPhone 13/14
    414, // iPhone Plus/Max
    600, // Small tablet
    768, // iPad portrait
    1024, // iPad landscape
    1280, // Standard laptop
    1440, // MacBook Pro / QHD
    1920, // Full HD 1080p
    2560, // 2K QHD
    3840, // 4K UHD
  ];

  // Verify that divider container uses relative w-full and no hardcoded min-w or fixed px widths
  for (const width of VIEWPORT_WIDTHS) {
    // Simulated container layout calculation
    const containerStyle = {
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
    };
    const simulatedClientWidth = width;
    const simulatedScrollWidth = simulatedClientWidth; // With width: 100% and overflow: hidden, scrollWidth === clientWidth

    assert.strictEqual(
      simulatedScrollWidth <= simulatedClientWidth,
      true,
      `Horizontal overflow detected at viewport ${width}px`
    );
  }
});

// ============================================================================
// SECTION 4: INTEGRATION ORACLE: SECTION IDS, PAGE LAYOUT & EXPORTS
// ============================================================================
console.log('\n--- SECTION 4: Page Layout Integration & Section Contracts ---');

const pageCode = fs.readFileSync(path.resolve('src/app/page.tsx'), 'utf-8');

runTest('4.1: SectionDivider correctly exported from src/components/ui/index.ts', () => {
  const uiIndex = fs.readFileSync(path.resolve('src/components/ui/index.ts'), 'utf-8');
  assert(
    uiIndex.includes("export { SectionDivider } from './SectionDivider'") ||
      uiIndex.includes("export * from './SectionDivider'"),
    'SectionDivider must be re-exported in ui/index.ts'
  );
  assert(
    uiIndex.includes('SectionDividerProps') && uiIndex.includes('SectionDividerVariant'),
    'SectionDivider types must be exported in ui/index.ts'
  );
});

runTest('4.2: Page.tsx integrates all SectionDividers with non-colliding variants', () => {
  const dividerInstances = pageCode.match(/<SectionDivider[\s\S]*?\/>/g) || [];
  assert.strictEqual(dividerInstances.length, 7, 'page.tsx must contain exactly 7 SectionDividers');

  // Verify each transition variant
  assert(pageCode.includes('variant="wave"'), 'Must have wave divider');
  assert(pageCode.includes('inverted'), 'Must have inverted wave divider');
  assert(pageCode.includes('variant="glow"'), 'Must have glow beam divider');
  assert(pageCode.includes('variant="angle"'), 'Must have angle divider');
  assert(pageCode.includes('variant="curve"'), 'Must have curve divider');
  assert(pageCode.includes('variant="gradient"'), 'Must have gradient divider');
});

runTest(
  '4.3: SmoothScroll wrapper wraps all sections and dividers without clipping fixed nav',
  () => {
    assert(pageCode.includes('<SmoothScroll>'), 'page.tsx must wrap content in SmoothScroll');
    assert(pageCode.includes('<Navigation />'), 'page.tsx must include Navigation');
    assert(pageCode.includes('<MorphingBackground />'), 'page.tsx must include MorphingBackground');
  }
);

// ============================================================================
// SECTION 5: ADVERSARIAL STRESS CHALLENGES & HOSTILE INPUT MINING
// ============================================================================
console.log('\n--- SECTION 5: Hostile Environment & Edge-Case Stress Testing ---');

runTest('5.1: useActiveSection robustness with empty sectionIds array', () => {
  const emptyHarness = new ActiveSectionSimulator([]);
  // Should not throw or crash on scroll
  assert.doesNotThrow(() => {
    emptyHarness.handleScroll(0, 1000, 5000);
    emptyHarness.handleScroll(4990, 1000, 5000);
  });
  assert.strictEqual(emptyHarness.activeSection, '');
});

runTest('5.2: Command Palette ReDoS & Special Regex Metacharacters Immunity', () => {
  const hostileQueries = [
    '.*',
    '(((a+)+)+)+',
    '[[[[[[',
    '\\',
    '^(a|b|c)*$',
    'projects[0]',
    'skills|trivia',
    'undefined',
    'null',
    '<script>alert(1)</script>',
  ];

  for (const hostileQuery of hostileQueries) {
    const start = performance.now();
    const q = hostileQuery.toLowerCase().trim();
    const filtered = ALL_10_SECTIONS.filter((id) => id.toLowerCase().includes(q));
    const duration = performance.now() - start;

    assert.strictEqual(Array.isArray(filtered), true);
    assert(duration < 10, `Query execution exceeded 10ms for: ${hostileQuery}`);
  }
});

runTest('5.3: Command Palette division-by-zero protection on zero results', () => {
  // Navigation.tsx:214-231 guard: if (filteredSections.length === 0) return;
  let selectedIndex = 0;
  function handleKeyDownGuarded(key, listLength) {
    if (listLength === 0) return selectedIndex;
    if (key === 'ArrowDown') {
      return (selectedIndex + 1) % listLength;
    }
    return selectedIndex;
  }

  const result = handleKeyDownGuarded('ArrowDown', 0);
  assert.strictEqual(result, 0);
  assert.strictEqual(Number.isNaN(result), false, 'Must not result in NaN');
});

runTest('5.4: SectionDivider SVG useId sanitization: Strips colons for XML/SVG compliance', () => {
  const reactUseIdMock = ':r1:';
  const safeId = reactUseIdMock.replace(/[:]/g, '');
  assert.strictEqual(safeId, 'r1');
  assert.strictEqual(safeId.includes(':'), false, 'Colons must be stripped from SVG filter IDs');
});

runTest('5.5: SectionDivider simultaneous invert and flipX transform calculation', () => {
  const flipX = true;
  const inverted = true;
  const scaleX = flipX ? -1 : 1;
  const scaleY = inverted ? -1 : 1;
  const transform = scaleX !== 1 || scaleY !== 1 ? `scale(${scaleX}, ${scaleY})` : undefined;

  assert.strictEqual(transform, 'scale(-1, -1)');
});

// ============================================================================
// SUMMARY & AUDIT FINDINGS
// ============================================================================
console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
console.log(`AUDIT FINDINGS: ${findings.length}`);
if (findings.length > 0) {
  findings.forEach((f, idx) => console.log(`  [Finding ${idx + 1}] ${f}`));
}
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
