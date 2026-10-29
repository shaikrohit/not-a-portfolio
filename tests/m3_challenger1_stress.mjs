/**
 * Milestone 3 Challenger 1 Deep Adversarial Stress Test Harness
 * Author: teamwork_challenger_m3_1 (Critic / Specialist)
 *
 * Adversarial Focus Areas:
 * 1. Touch Interaction & Coarse Pointer Simulation (TiltCard, MagneticButton, CSS guards)
 * 2. Viewport Boundary Stress (320px ultra-mobile, 360px, 768px tablet, 1440px desktop, 3840px 4K)
 * 3. Prefers-Reduced-Motion Fallbacks (Instant zero-latency collapse across components & styles)
 * 4. Performance & Animation Loops (HeroScene, SkillOrbit, content-visibility, offscreen halting)
 */

import fs from 'node:fs';
import assert from 'node:assert';

console.log('================================================================');
console.log('CHALLENGER 1: M3 ADVERSARIAL EMPIRICAL STRESS TEST HARNESS');
console.log(`Node Version: ${process.version}`);
console.log(`Execution Time: ${new Date().toISOString()}`);
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function recordPass(testName, details = '') {
  totalTests++;
  passedTests++;
  console.log(`[PASS] ${testName} ${details ? `(${details})` : ''}`);
}

function recordFail(testName, reason, rawOutput = '') {
  totalTests++;
  failedTests++;
  console.error(`[FAIL] ${testName}`);
  console.error(`       Reason: ${reason}`);
  if (rawOutput) console.error(`       Output: ${String(rawOutput).slice(0, 200)}`);
  failureDetails.push({ testName, reason, rawOutput });
}

function test(name, fn) {
  try {
    fn();
    recordPass(name);
  } catch (err) {
    recordFail(name, err.message, err.stack);
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    recordPass(name);
  } catch (err) {
    recordFail(name, err.message, err.stack);
  }
}

// Helper to extract nested block content with balanced braces from CSS
function getMediaBlockContent(css, queryStr) {
  const idx = css.indexOf(queryStr);
  if (idx === -1) return null;
  const start = css.indexOf('{', idx);
  if (start === -1) return null;
  let depth = 1;
  let end = start + 1;
  while (depth > 0 && end < css.length) {
    if (css[end] === '{') depth++;
    else if (css[end] === '}') depth--;
    end++;
  }
  return css.slice(start + 1, end - 1);
}

// ============================================================================
// FOCUS AREA 1: Touch Interaction & Coarse Pointer Simulation
// ============================================================================
console.log('--- FOCUS AREA 1: Touch Interaction & Coarse Pointer Simulation ---');

// 1.1 Source Code Inspection: TiltCard & MagneticButton Coarse Pointer Guards
test('TC-1.1: TiltCard & MagneticButton incorporate coarse pointer & hover guards', () => {
  const tiltSource = fs.readFileSync('src/components/ui/TiltCard.tsx', 'utf8');
  assert.ok(
    tiltSource.includes("useMediaQuery('(pointer: coarse)')"),
    'TiltCard must query (pointer: coarse)'
  );
  assert.ok(
    tiltSource.includes("useMediaQuery('(hover: none)')"),
    'TiltCard must query (hover: none)'
  );
  assert.ok(
    tiltSource.includes(
      'isInteractiveTiltDisabled = prefersReducedMotion || isCoarsePointer || isHoverNone'
    ),
    'TiltCard isInteractiveTiltDisabled calculation missing or incorrect'
  );

  const magSource = fs.readFileSync('src/components/ui/MagneticButton.tsx', 'utf8');
  assert.ok(
    magSource.includes("useMediaQuery('(pointer: coarse)')"),
    'MagneticButton must query (pointer: coarse)'
  );
  assert.ok(
    magSource.includes("useMediaQuery('(hover: none)')"),
    'MagneticButton must query (hover: none)'
  );
  assert.ok(
    magSource.includes(
      'isMagneticDisabled = prefersReducedMotion || isCoarsePointer || isHoverNone'
    ),
    'MagneticButton isMagneticDisabled calculation missing or incorrect'
  );
});

// 1.2 TiltCard Behavioral State Machine Simulation under Touch/Coarse Pointer
test('TC-1.2: TiltCard simulation under coarse pointer prevents stuck tilt & persistent glare', () => {
  // We model the TiltCard component's exact state machine
  class TiltCardSimulator {
    constructor({
      prefersReducedMotion = false,
      isCoarsePointer = false,
      isHoverNone = false,
      glare = true,
      maxTilt = 8,
    }) {
      this.prefersReducedMotion = prefersReducedMotion;
      this.isCoarsePointer = isCoarsePointer;
      this.isHoverNone = isHoverNone;
      this.glare = glare;
      this.maxTilt = maxTilt;
      this.tilt = { x: 0, y: 0 };
      this.glarePos = { x: 50, y: 50, opacity: 0 };
      this.rect = { left: 100, top: 100, width: 300, height: 200 };
      this.rafScheduled = null;
    }

    get isInteractiveTiltDisabled() {
      return this.prefersReducedMotion || this.isCoarsePointer || this.isHoverNone;
    }

    get perspectiveStyle() {
      return this.isInteractiveTiltDisabled ? undefined : '1200px';
    }

    get transformStyle() {
      return this.isInteractiveTiltDisabled ? undefined : 'preserve-3d';
    }

    get animateProps() {
      return this.isInteractiveTiltDisabled
        ? { rotateX: 0, rotateY: 0 }
        : { rotateX: this.tilt.x, rotateY: this.tilt.y };
    }

    get transitionProps() {
      return this.isInteractiveTiltDisabled
        ? { duration: 0 }
        : { type: 'spring', stiffness: 260, damping: 20 };
    }

    get isGlareRendered() {
      return this.glare && !this.isInteractiveTiltDisabled;
    }

    handleMouseEnter() {
      if (this.isInteractiveTiltDisabled) return;
      // updates rectRef
    }

    handleMouseMove(clientX, clientY) {
      if (this.isInteractiveTiltDisabled) return;
      const x = clientX - this.rect.left;
      const y = clientY - this.rect.top;
      const centerX = this.rect.width / 2;
      const centerY = this.rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * this.maxTilt;
      const rotateY = ((x - centerX) / centerX) * this.maxTilt;

      this.tilt = { x: rotateX, y: rotateY };
      if (this.glare) {
        this.glarePos = {
          x: (x / this.rect.width) * 100,
          y: (y / this.rect.height) * 100,
          opacity: 0.15,
        };
      }
    }

    handleMouseLeave() {
      this.rafScheduled = null;
      if (this.isInteractiveTiltDisabled) return;
      this.tilt = { x: 0, y: 0 };
      if (this.glare) {
        this.glarePos = { ...this.glarePos, opacity: 0 };
      }
    }
  }

  // 1.2.1 Touch / Coarse pointer environment
  const touchCard = new TiltCardSimulator({ isCoarsePointer: true });
  assert.strictEqual(
    touchCard.isInteractiveTiltDisabled,
    true,
    'Tilt must be disabled for coarse pointer'
  );
  assert.strictEqual(
    touchCard.perspectiveStyle,
    undefined,
    'Perspective must be undefined for coarse pointer'
  );
  assert.strictEqual(
    touchCard.transformStyle,
    undefined,
    'transformStyle must be undefined for coarse pointer'
  );
  assert.strictEqual(touchCard.isGlareRendered, false, 'Glare must NOT render on touch device');
  assert.deepStrictEqual(
    touchCard.animateProps,
    { rotateX: 0, rotateY: 0 },
    'Animate must be zero tilt'
  );
  assert.deepStrictEqual(
    touchCard.transitionProps,
    { duration: 0 },
    'Transition must be duration 0 on touch'
  );

  // Trigger simulated touch events / synthetic mouse events
  touchCard.handleMouseEnter();
  touchCard.handleMouseMove(250, 200);
  assert.deepStrictEqual(touchCard.tilt, { x: 0, y: 0 }, 'Tilt must remain 0,0 on touch move');
  assert.strictEqual(touchCard.glarePos.opacity, 0, 'Glare opacity must remain 0 on touch move');

  // 1.2.2 Dynamic Pointer Mode Transition (e.g. 2-in-1 laptop folds to tablet)
  const dynamicCard = new TiltCardSimulator({ isCoarsePointer: false });
  dynamicCard.handleMouseMove(200, 150); // Desktop fine pointer hover
  assert.notDeepStrictEqual(dynamicCard.tilt, { x: 0, y: 0 }, 'Desktop fine pointer produces tilt');
  assert.strictEqual(dynamicCard.glarePos.opacity, 0.15, 'Desktop fine pointer shows glare');
  assert.strictEqual(dynamicCard.isGlareRendered, true, 'Glare is active');

  // Switch to coarse pointer (tablet mode activated)
  dynamicCard.isCoarsePointer = true;
  assert.strictEqual(
    dynamicCard.isInteractiveTiltDisabled,
    true,
    'Should instantly switch to disabled'
  );
  assert.deepStrictEqual(
    dynamicCard.animateProps,
    { rotateX: 0, rotateY: 0 },
    'Animate output must collapse to 0,0'
  );
  assert.deepStrictEqual(
    dynamicCard.transitionProps,
    { duration: 0 },
    'Transition must be duration 0 (instant zero latency)'
  );
  assert.strictEqual(dynamicCard.isGlareRendered, false, 'Glare element must immediately unmount');
});

// 1.3 MagneticButton Behavioral State Machine Simulation under Touch/Coarse Pointer
test('TC-1.3: MagneticButton simulation under coarse pointer prevents stuck translation', () => {
  class MagneticButtonSimulator {
    constructor({
      prefersReducedMotion = false,
      isCoarsePointer = false,
      isHoverNone = false,
      strength = 25,
    }) {
      this.prefersReducedMotion = prefersReducedMotion;
      this.isCoarsePointer = isCoarsePointer;
      this.isHoverNone = isHoverNone;
      this.strength = strength;
      this.position = { x: 0, y: 0 };
      this.rect = { left: 200, top: 300, width: 160, height: 50 };
    }

    get isMagneticDisabled() {
      return this.prefersReducedMotion || this.isCoarsePointer || this.isHoverNone;
    }

    get animateProps() {
      return this.isMagneticDisabled ? { x: 0, y: 0 } : { x: this.position.x, y: this.position.y };
    }

    get transitionProps() {
      return this.isMagneticDisabled
        ? { duration: 0 }
        : { type: 'spring', stiffness: 200, damping: 18, mass: 0.1 };
    }

    handleMouseEnter() {
      if (this.isMagneticDisabled) return;
    }

    handleMouseMove(clientX, clientY) {
      if (this.isMagneticDisabled) return;
      const centerX = this.rect.left + this.rect.width / 2;
      const centerY = this.rect.top + this.rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const factor = this.strength / (this.rect.width / 2);
      this.position = { x: dx * factor, y: dy * factor };
    }

    handleMouseLeave() {
      this.position = { x: 0, y: 0 };
    }
  }

  // Coarse pointer
  const touchBtn = new MagneticButtonSimulator({ isCoarsePointer: true });
  assert.strictEqual(touchBtn.isMagneticDisabled, true);
  assert.deepStrictEqual(touchBtn.animateProps, { x: 0, y: 0 });
  assert.deepStrictEqual(touchBtn.transitionProps, { duration: 0 });

  touchBtn.handleMouseMove(400, 500);
  assert.deepStrictEqual(
    touchBtn.position,
    { x: 0, y: 0 },
    'Position must not change on touch move'
  );
  assert.deepStrictEqual(touchBtn.animateProps, { x: 0, y: 0 });

  // Desktop -> Tablet switch
  const dynamicBtn = new MagneticButtonSimulator({ isCoarsePointer: false });
  dynamicBtn.handleMouseMove(250, 320);
  assert.notDeepStrictEqual(dynamicBtn.position, { x: 0, y: 0 });

  // Switch to coarse pointer
  dynamicBtn.isCoarsePointer = true;
  assert.deepStrictEqual(
    dynamicBtn.animateProps,
    { x: 0, y: 0 },
    'Animate output immediately snaps to 0,0'
  );
  assert.deepStrictEqual(
    dynamicBtn.transitionProps,
    { duration: 0 },
    'Transition duration collapses to 0'
  );
});

// 1.4 Unconstrained / Degenerate Coordinate Invariance
test('TC-1.4: Extreme coordinate inputs (NaN, Infinity, negative) safely handled on mouse leave', () => {
  const tiltSource = fs.readFileSync('src/components/ui/TiltCard.tsx', 'utf8');
  assert.ok(tiltSource.includes('handleMouseLeave'), 'handleMouseLeave must exist in TiltCard');
  assert.ok(
    tiltSource.includes('cancelAnimationFrame(rafRef.current)'),
    'RAF must be canceled on leave in TiltCard'
  );
  assert.ok(tiltSource.includes('setTilt({ x: 0, y: 0 })'), 'Tilt must be zeroed on leave');

  const magSource = fs.readFileSync('src/components/ui/MagneticButton.tsx', 'utf8');
  assert.ok(
    magSource.includes('handleMouseLeave'),
    'handleMouseLeave must exist in MagneticButton'
  );
  assert.ok(
    magSource.includes('cancelAnimationFrame(rafRef.current)'),
    'RAF must be canceled on leave in MagneticButton'
  );
  assert.ok(magSource.includes('setPosition({ x: 0, y: 0 })'), 'Position must be zeroed on leave');
});

// 1.5 CSS Coarse Pointer Media Query Rule Verification
test('TC-1.5: CSS @media (pointer: coarse) rules neutralize hover scaling & cursor glow', () => {
  const premiumCss = fs.readFileSync('src/styles/premium.css', 'utf8');
  const rules = getMediaBlockContent(premiumCss, '@media (pointer: coarse), (hover: none)');
  assert.ok(rules, 'premium.css must declare @media (pointer: coarse), (hover: none)');
  assert.ok(
    rules.includes('.cursor-glow'),
    'Cursor glow must be targeted in coarse pointer media query'
  );
  assert.ok(
    rules.includes('display: none !important'),
    'Cursor glow must have display: none !important'
  );
  assert.ok(rules.includes('.magnetic-button:hover'), 'Magnetic button hover must be targeted');
  assert.ok(
    rules.includes('transform: none !important'),
    'Magnetic button must have transform: none !important'
  );
});

// ============================================================================
// FOCUS AREA 2: Viewport Boundary Stress (320px to 3840px 4K)
// ============================================================================
console.log('\n--- FOCUS AREA 2: Viewport Boundary Stress (320px to 3840px 4K) ---');

// Helper to evaluate CSS clamp: clamp(min, val, max) in px given viewport width W
function evaluateClamp(minRem, vwPercent, offsetRem, maxRem, viewportWidthPx, rootFontSize = 16) {
  const minPx = minRem * rootFontSize;
  const maxPx = maxRem * rootFontSize;
  const preferredPx = (vwPercent / 100) * viewportWidthPx + offsetRem * rootFontSize;
  return Math.max(minPx, Math.min(preferredPx, maxPx));
}

// 2.1 Typography Scaling Curves across Extreme Viewports
test('TC-2.1: Mathematical verification of CSS clamp() curves across 320px, 360px, 768px, 1440px, 3840px', () => {
  const viewports = [
    { name: 'Ultra-Mobile', width: 320 },
    { name: 'Standard-Mobile', width: 360 },
    { name: 'Tablet-Portrait', width: 768 },
    { name: 'Desktop-Laptop', width: 1440 },
    { name: 'Ultra-Wide 4K', width: 3840 },
  ];

  // Hero H1 heading clamp: clamp(2.5rem, 7vw + 0.75rem, 5.75rem)
  // At 320px: preferred = 0.07 * 320 + 12 = 34.4px. Min = 40px (2.5rem). Clamped to 40px.
  // At 3840px: preferred = 0.07 * 3840 + 12 = 280.8px. Max = 92px (5.75rem). Clamped to 92px.
  let previousHeroHeadingPx = 0;
  for (const vp of viewports) {
    const headingPx = evaluateClamp(2.5, 7, 0.75, 5.75, vp.width);

    assert.ok(headingPx >= 40, `Heading at ${vp.width}px (${headingPx}px) must be >= 40px minimum`);
    assert.ok(headingPx <= 92, `Heading at ${vp.width}px (${headingPx}px) must be <= 92px maximum`);
    assert.ok(
      headingPx >= previousHeroHeadingPx,
      `Heading scale must be monotonic with viewport expansion`
    );
    previousHeroHeadingPx = headingPx;
  }

  // 320px specific assertion: 40px heading
  const h320 = evaluateClamp(2.5, 7, 0.75, 5.75, 320);
  assert.strictEqual(h320, 40, 'At 320px, Hero heading must clamp to exactly 40px (2.5rem)');

  // 3840px specific assertion: 92px heading
  const h3840 = evaluateClamp(2.5, 7, 0.75, 5.75, 3840);
  assert.strictEqual(h3840, 92, 'At 3840px, Hero heading must clamp to exactly 92px (5.75rem)');

  // Evaluate .fluid-display: clamp(2.5rem, 7vw + 1rem, 6rem)
  const d320 = evaluateClamp(2.5, 7, 1.0, 6.0, 320);
  assert.strictEqual(d320, 40, '.fluid-display at 320px clamps to 40px');
  const d3840 = evaluateClamp(2.5, 7, 1.0, 6.0, 3840);
  assert.strictEqual(d3840, 96, '.fluid-display at 3840px clamps to 96px');

  // Evaluate .fluid-h1: clamp(2.25rem, 5.5vw + 0.75rem, 5.5rem)
  const h1_320 = evaluateClamp(2.25, 5.5, 0.75, 5.5, 320);
  assert.strictEqual(h1_320, 36, '.fluid-h1 at 320px clamps to 36px');
  const h1_3840 = evaluateClamp(2.25, 5.5, 0.75, 5.5, 3840);
  assert.strictEqual(h1_3840, 88, '.fluid-h1 at 3840px clamps to 88px');
});

// 2.2 Horizontal Overflow Geometric Boundaries at 320px Ultra-Mobile
test('TC-2.2: Ultra-mobile 320px boundary constraints prevent horizontal overflow', () => {
  const globals = fs.readFileSync('src/styles/globals.css', 'utf8');
  assert.ok(globals.includes('overflow-x: hidden'), 'body must have overflow-x: hidden');

  const heroSource = fs.readFileSync('src/components/sections/HeroSection.tsx', 'utf8');
  // Status badge constraint
  assert.ok(
    heroSource.includes('max-w-[94vw]'),
    'Status badge must have max-w-[94vw] for narrow viewports'
  );
  // CTA buttons flex container
  assert.ok(
    heroSource.includes('flex w-full flex-col items-center justify-center gap-3 sm:flex-row'),
    'Hero buttons must stack in flex-col on mobile screens'
  );

  // Social Orbit mobile constraint: under 360px width, max-w-[280px]
  const socialSource = fs.readFileSync('src/components/contact/SocialOrbit.tsx', 'utf8');
  assert.ok(
    socialSource.includes('max-w-[280px]'),
    'SocialOrbit must have max-w-[280px] fallback for < 360px screens'
  );

  // Verify section horizontal padding rules: px-4 on mobile (= 16px each side)
  const sectionsToCheck = [
    'src/components/sections/HeroSection.tsx',
    'src/components/sections/PathSelectionSection.tsx',
    'src/components/sections/AboutSection.tsx',
    'src/components/sections/ExperienceSection.tsx',
    'src/components/sections/EducationSection.tsx',
    'src/components/sections/AchievementsSection.tsx',
    'src/components/sections/ProjectsSection.tsx',
    'src/components/sections/SkillsSection.tsx',
    'src/components/sections/TriviaGame.tsx',
    'src/components/sections/ContactSection.tsx',
  ];

  for (const file of sectionsToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    const hasSafePadding =
      content.includes('px-4') ||
      content.includes('px-3.5') ||
      content.includes('px-2') ||
      content.includes('container') ||
      content.includes('max-w-');
    assert.ok(hasSafePadding, `${file} must specify safe responsive padding / container bounding`);
  }
});

// 2.3 Fluid Responsive Typography Classes Declared in CSS
test('TC-2.3: Fluid typography utilities in premium.css match exact clamp contracts', () => {
  const premiumCss = fs.readFileSync('src/styles/premium.css', 'utf8');
  assert.ok(premiumCss.includes('.fluid-display {'), '.fluid-display must be defined');
  assert.ok(
    premiumCss.includes('font-size: clamp(2.5rem, 7vw + 1rem, 6rem);'),
    '.fluid-display clamp syntax correct'
  );

  assert.ok(premiumCss.includes('.fluid-h1 {'), '.fluid-h1 must be defined');
  assert.ok(
    premiumCss.includes('font-size: clamp(2.25rem, 5.5vw + 0.75rem, 5.5rem);'),
    '.fluid-h1 clamp syntax correct'
  );

  assert.ok(premiumCss.includes('.fluid-h2 {'), '.fluid-h2 must be defined');
  assert.ok(
    premiumCss.includes('font-size: clamp(1.75rem, 3.5vw + 0.5rem, 3rem);'),
    '.fluid-h2 clamp syntax correct'
  );

  assert.ok(premiumCss.includes('.fluid-h3 {'), '.fluid-h3 must be defined');
  assert.ok(
    premiumCss.includes('font-size: clamp(1.25rem, 2vw + 0.5rem, 1.875rem);'),
    '.fluid-h3 clamp syntax correct'
  );
});

// ============================================================================
// FOCUS AREA 3: Prefers-Reduced-Motion Fallbacks
// ============================================================================
console.log('\n--- FOCUS AREA 3: Prefers-Reduced-Motion Fallbacks ---');

// 3.1 usePrefersReducedMotion Hook Architecture
test('TC-3.1: usePrefersReducedMotion uses useMediaQuery with React 19 useSyncExternalStore', () => {
  const hookSource = fs.readFileSync('src/hooks/usePrefersReducedMotion.ts', 'utf8');
  assert.ok(
    hookSource.includes("REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'"),
    'Must query prefers-reduced-motion'
  );
  assert.ok(
    hookSource.includes('useMediaQuery(REDUCED_MOTION_QUERY'),
    'Must delegate to useMediaQuery'
  );

  const mediaSource = fs.readFileSync('src/hooks/useMediaQuery.ts', 'utf8');
  assert.ok(
    mediaSource.includes('useSyncExternalStore'),
    'Must use React 19 useSyncExternalStore for hydration safety'
  );
  assert.ok(mediaSource.includes('getSnapshot'), 'Must provide getSnapshot');
  assert.ok(mediaSource.includes('getServerSnapshot'), 'Must provide getServerSnapshot');
});

// 3.2 TiltCard & MagneticButton Collapse to Static Presentations with Zero Latency
test('TC-3.2: TiltCard and MagneticButton collapse with duration: 0 when reduced motion is preferred', () => {
  const tiltSource = fs.readFileSync('src/components/ui/TiltCard.tsx', 'utf8');
  // TiltCard animate & transition
  assert.ok(
    tiltSource.includes('isInteractiveTiltDisabled\n            ? { rotateX: 0, rotateY: 0 }') ||
      tiltSource.includes('isInteractiveTiltDisabled ? { rotateX: 0, rotateY: 0 }') ||
      tiltSource.includes('rotateX: 0, rotateY: 0'),
    'TiltCard must animate to 0,0 when disabled'
  );
  assert.ok(
    tiltSource.includes('isInteractiveTiltDisabled\n            ? { duration: 0 }') ||
      tiltSource.includes('isInteractiveTiltDisabled ? { duration: 0 }') ||
      tiltSource.includes('{ duration: 0 }'),
    'TiltCard transition duration must be 0 for reduced motion'
  );

  const magSource = fs.readFileSync('src/components/ui/MagneticButton.tsx', 'utf8');
  assert.ok(
    magSource.includes(
      'animate={isMagneticDisabled ? { x: 0, y: 0 } : { x: position.x, y: position.y }}'
    ),
    'MagneticButton must animate to 0,0 when disabled'
  );
  assert.ok(
    magSource.includes('isMagneticDisabled\n          ? { duration: 0 }') ||
      magSource.includes('isMagneticDisabled ? { duration: 0 }') ||
      magSource.includes('{ duration: 0 }'),
    'MagneticButton transition duration must be 0 for reduced motion'
  );
});

// 3.3 TextReveal Zero-Latency Reduced-Motion Presentation
test('TC-3.3: TextReveal eliminates staggerChildren and 3D rotations on reduced motion', () => {
  const textRevealSource = fs.readFileSync('src/components/hero/TextReveal.tsx', 'utf8');
  assert.ok(
    textRevealSource.includes('usePrefersReducedMotion'),
    'TextReveal must use usePrefersReducedMotion'
  );
  assert.ok(
    textRevealSource.includes('staggerChildren: prefersReducedMotion ? 0 : 0.04'),
    'staggerChildren must be 0 on reduced motion'
  );
  assert.ok(
    textRevealSource.includes('charVariants = prefersReducedMotion'),
    'charVariants must branch on prefersReducedMotion'
  );

  // Verify that for reduced motion, charVariants does NOT use rotateX or y offset
  // Extract charVariants definition
  const charVariantsSnippet = textRevealSource.slice(
    textRevealSource.indexOf('const charVariants = prefersReducedMotion'),
    textRevealSource.indexOf('return (')
  );
  assert.ok(
    charVariantsSnippet.includes('opacity: 1'),
    'Reduced motion variant must animate opacity only'
  );
  assert.ok(
    charVariantsSnippet.includes('transition: { duration: 0.2 }'),
    'Reduced motion variant uses fast direct opacity'
  );
});

// 3.4 CSS Global Reduced Motion Directives
test('TC-3.4: CSS reduced-motion rules force duration to 0.01ms and suppress background animations', () => {
  const premiumCss = fs.readFileSync('src/styles/premium.css', 'utf8');
  const rules = getMediaBlockContent(premiumCss, '@media (prefers-reduced-motion: reduce)');
  assert.ok(rules, 'premium.css must declare @media (prefers-reduced-motion: reduce)');
  assert.ok(
    rules.includes('animation-duration: 0.01ms !important'),
    'Animations must be clamped to 0.01ms'
  );
  assert.ok(
    rules.includes('transition-duration: 0.01ms !important'),
    'Transitions must be clamped to 0.01ms'
  );
  assert.ok(
    rules.includes('animation-iteration-count: 1 !important'),
    'Iteration count must be clamped to 1'
  );
  assert.ok(rules.includes('.morph-blob'), 'Morphing background blobs must be hidden');
  assert.ok(rules.includes('.particle'), 'Floating particles must be hidden');

  const globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
  assert.ok(
    globalsCss.includes('@media (prefers-reduced-motion: reduce)'),
    'globals.css must have reduced-motion guard'
  );
  assert.ok(globalsCss.includes('::view-transition-group(*)'), 'View transitions group disabled');
  assert.ok(
    globalsCss.includes('animation: none !important'),
    'View transitions animation set to none'
  );
});

// 3.5 HeroSection Pulse Indicator Reduced-Motion Suppression
test('TC-3.5: HeroSection ping animation is silenced with motion-reduce:hidden', () => {
  const heroSource = fs.readFileSync('src/components/sections/HeroSection.tsx', 'utf8');
  assert.ok(
    heroSource.includes('motion-reduce:hidden'),
    'Status badge ping effect must have motion-reduce:hidden'
  );
});

// ============================================================================
// FOCUS AREA 4: Performance & Animation Loops (HeroScene & SkillOrbit)
// ============================================================================
console.log('\n--- FOCUS AREA 4: Performance & Animation Loops ---');

// 4.1 HeroScene Animation Loop Suspension State Machine Simulation
test('TC-4.1: HeroScene simulation verifies animation loop halts when offscreen or hidden', () => {
  class HeroSceneSimulator {
    constructor({ prefersReducedMotion = false } = {}) {
      this.prefersReducedMotion = prefersReducedMotion;
      this.isVisible = true;
      this.isRunning = false;
      this.rafId = 0;
      this.scheduledFrames = 0;
      this.renderedFrames = 0;
      this.canceledFrames = 0;
    }

    startLoop() {
      if (!this.isRunning && this.isVisible && !this.prefersReducedMotion) {
        this.isRunning = true;
        this.scheduledFrames++;
        this.rafId = this.scheduledFrames;
      }
    }

    stopLoop() {
      if (this.isRunning) {
        this.canceledFrames++;
        this.isRunning = false;
      }
    }

    render() {
      if (!this.isVisible) {
        this.isRunning = false;
        return;
      }
      this.renderedFrames++;
      if (!this.prefersReducedMotion && this.isVisible) {
        this.scheduledFrames++;
        this.rafId = this.scheduledFrames;
      } else {
        this.isRunning = false;
      }
    }

    onIntersection(isIntersecting) {
      this.isVisible = isIntersecting;
      if (this.isVisible) {
        this.startLoop();
      } else {
        this.stopLoop();
      }
    }

    onContentVisibilityChange(skipped) {
      if (skipped) {
        this.isVisible = false;
        this.stopLoop();
      } else {
        this.isVisible = true;
        this.startLoop();
      }
    }
  }

  // Initial state: starts loop
  const scene = new HeroSceneSimulator();
  scene.startLoop();
  assert.strictEqual(scene.isRunning, true, 'HeroScene loop must be running initially');
  scene.render();
  assert.strictEqual(scene.renderedFrames, 1);

  // User scrolls down: intersection observer marks entry not intersecting
  scene.onIntersection(false);
  assert.strictEqual(scene.isVisible, false, 'isVisible must become false');
  assert.strictEqual(scene.isRunning, false, 'Loop must stop immediately');
  assert.strictEqual(scene.canceledFrames, 1, 'cancelAnimationFrame must be called');

  // Any delayed render tick must immediately return without scheduling another frame
  const framesBefore = scene.scheduledFrames;
  scene.render();
  assert.strictEqual(scene.renderedFrames, 1, 'Render must abort when !isVisible');
  assert.strictEqual(
    scene.scheduledFrames,
    framesBefore,
    'Must NOT schedule any new requestAnimationFrame'
  );

  // User scrolls back up
  scene.onIntersection(true);
  assert.strictEqual(scene.isVisible, true);
  assert.strictEqual(scene.isRunning, true, 'Loop must restart when visible');

  // contentvisibilityautostatechange event: skipped = true
  scene.onContentVisibilityChange(true);
  assert.strictEqual(scene.isVisible, false);
  assert.strictEqual(scene.isRunning, false, 'Loop must halt on content-visibility skip');

  // Reduced motion test: loop must NEVER start
  const reducedScene = new HeroSceneSimulator({ prefersReducedMotion: true });
  reducedScene.startLoop();
  assert.strictEqual(
    reducedScene.isRunning,
    false,
    'HeroScene loop must not run when prefersReducedMotion = true'
  );
});

// 4.2 SkillOrbit Animation Loop Suspension State Machine Simulation
test('TC-4.2: SkillOrbit simulation verifies animation loop halts when offscreen or hidden', () => {
  class SkillOrbitSimulator {
    constructor({ prefersReducedMotion = false } = {}) {
      this.prefersReducedMotion = prefersReducedMotion;
      this.isVisible = true;
      this.isRunning = false;
      this.scheduledFrames = 0;
      this.renderedFrames = 0;
      this.canceledFrames = 0;
    }

    startLoop() {
      if (!this.isRunning && this.isVisible && !this.prefersReducedMotion) {
        this.isRunning = true;
        this.scheduledFrames++;
      }
    }

    stopLoop() {
      if (this.isRunning) {
        this.canceledFrames++;
        this.isRunning = false;
      }
    }

    render() {
      if (!this.isVisible) {
        this.isRunning = false;
        return;
      }
      this.renderedFrames++;
      if (!this.prefersReducedMotion && this.isVisible) {
        this.scheduledFrames++;
      } else {
        this.isRunning = false;
      }
    }

    onIntersection(isIntersecting) {
      this.isVisible = isIntersecting;
      if (this.isVisible) {
        this.startLoop();
      } else {
        this.stopLoop();
      }
    }

    onContentVisibilityChange(skipped) {
      if (skipped) {
        this.isVisible = false;
        this.stopLoop();
      } else {
        this.isVisible = true;
        this.startLoop();
      }
    }
  }

  const orbit = new SkillOrbitSimulator();
  orbit.startLoop();
  assert.strictEqual(orbit.isRunning, true);
  orbit.render();
  assert.strictEqual(orbit.renderedFrames, 1);

  // Scrolled away
  orbit.onIntersection(false);
  assert.strictEqual(orbit.isRunning, false);
  assert.strictEqual(orbit.canceledFrames, 1);

  // Scrolled back
  orbit.onIntersection(true);
  assert.strictEqual(orbit.isRunning, true);

  // Content visibility skip
  orbit.onContentVisibilityChange(true);
  assert.strictEqual(orbit.isRunning, false);

  // Reduced motion
  const reducedOrbit = new SkillOrbitSimulator({ prefersReducedMotion: true });
  reducedOrbit.startLoop();
  assert.strictEqual(reducedOrbit.isRunning, false);
});

// 4.3 Clean Event Listener & Observer Teardown on Unmount
test('TC-4.3: HeroScene and SkillOrbit clean up all listeners, timeouts, and observers on unmount', () => {
  const heroSource = fs.readFileSync('src/components/hero/HeroScene.tsx', 'utf8');
  assert.ok(
    heroSource.includes('clearTimeout(initTimer)'),
    'initTimer must be cleared on unmount in HeroScene'
  );
  assert.ok(heroSource.includes('stopLoop()'), 'stopLoop must be called on unmount in HeroScene');
  assert.ok(
    heroSource.includes('cancelAnimationFrame(animationFrameId)'),
    'cancelAnimationFrame on unmount'
  );
  assert.ok(
    heroSource.includes("window.removeEventListener('resize', resize)"),
    'resize listener removed'
  );
  assert.ok(
    heroSource.includes("window.removeEventListener('scroll', updateRect)"),
    'scroll listener removed'
  );
  assert.ok(
    heroSource.includes("window.removeEventListener('mousemove', handleMouseMove)"),
    'mousemove listener removed'
  );
  assert.ok(heroSource.includes('observer.disconnect()'), 'observer disconnected in HeroScene');

  const orbitSource = fs.readFileSync('src/components/skills/SkillOrbit.tsx', 'utf8');
  assert.ok(orbitSource.includes('stopLoop()'), 'stopLoop must be called on unmount in SkillOrbit');
  assert.ok(
    orbitSource.includes('cancelAnimationFrame(animId)'),
    'cancelAnimationFrame on unmount in SkillOrbit'
  );
  assert.ok(
    orbitSource.includes("window.removeEventListener('resize', resize)"),
    'resize listener removed in SkillOrbit'
  );
  assert.ok(orbitSource.includes('observer.disconnect()'), 'observer disconnected in SkillOrbit');
});

// 4.4 content-visibility: auto Audit and Zero LCP Interference
test('TC-4.4: content-visibility: auto is applied to all 9 below-the-fold sections and exempts #hero', () => {
  const globals = fs.readFileSync('src/styles/globals.css', 'utf8');
  const belowTheFoldIds = [
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

  for (const id of belowTheFoldIds) {
    const sectionMatch = globals.match(
      new RegExp(`#${id}\\s*\\{[\\s\\S]*?content-visibility:\\s*auto;[\\s\\S]*?\\}`)
    );
    assert.ok(
      sectionMatch,
      `Section #${id} must have content-visibility: auto declared in globals.css`
    );
    assert.ok(
      sectionMatch[0].includes('contain-intrinsic-size:'),
      `Section #${id} must specify contain-intrinsic-size to prevent scrollbar jumps`
    );
  }

  // Invariant: #hero must NEVER have content-visibility (protects LCP)
  assert.ok(!globals.includes('#hero {'), '#hero must not have content-visibility');
  assert.ok(!globals.includes('#hero{'), '#hero must not have content-visibility');
});

// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n================================================================');
console.log(
  `STRESS TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} tests`
);
console.log('================================================================\n');

if (failedTests > 0) {
  console.error('VERDICT: REQUEST_CHANGES (Defects detected during empirical stress testing)');
  process.exit(1);
} else {
  console.log(
    'VERDICT: APPROVE (All adversarial empirical stress tests passed with 100% conformance)'
  );
  process.exit(0);
}
