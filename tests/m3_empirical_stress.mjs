/**
 * Empirical Stress Test Harness for Milestone 3
 * Responsiveness & Mobile (Phase 10), Performance & Anti-Lag (Phase 11), Semantic HTML & SEO (Phase 12)
 *
 * Modules:
 * 1. Mobile Responsiveness, Coarse Pointer & Reduced Motion Invariants
 * 2. Performance, Dynamic Skeletons & Content-Visibility Architecture
 * 3. Semantic HTML, WAI-ARIA Tabs, Keyboard Focus & JSON-LD SEO Validation
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
console.log('STARTING EMPIRICAL STRESS TEST SUITE: MILESTONE 3 (RESPONSIVENESS, PERF, A11Y, SEO)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// MODULE 1: Responsiveness, Coarse Pointer & Reduced Motion Invariants (Phase 10)
// -----------------------------------------------------------------------------
console.log('--- MODULE 1: Responsiveness, Coarse Pointer & Reduced Motion Invariants ---');

// 1.1 Hooks Existence and API Contract
test('Hooks: useMediaQuery and usePrefersReducedMotion exist with useSyncExternalStore', () => {
  assert.ok(fs.existsSync('src/hooks/useMediaQuery.ts'), 'useMediaQuery.ts missing');
  assert.ok(
    fs.existsSync('src/hooks/usePrefersReducedMotion.ts'),
    'usePrefersReducedMotion.ts missing'
  );

  const mediaSource = fs.readFileSync('src/hooks/useMediaQuery.ts', 'utf8');
  assert.match(
    mediaSource,
    /useSyncExternalStore/,
    'useMediaQuery must use React 19 useSyncExternalStore'
  );
  assert.match(mediaSource, /typeof window === ['"]undefined['"]/, 'SSR guard missing');
  assert.match(mediaSource, /export function useCoarsePointer/, 'useCoarsePointer export missing');

  const reducedMotionSource = fs.readFileSync('src/hooks/usePrefersReducedMotion.ts', 'utf8');
  assert.match(
    reducedMotionSource,
    /\(prefers-reduced-motion:\s*reduce\)/,
    'Reduced motion media query missing'
  );

  const indexSource = fs.readFileSync('src/hooks/index.ts', 'utf8');
  assert.match(
    indexSource,
    /export\s*\{\s*useMediaQuery,\s*useCoarsePointer\s*\}\s*from\s*['"]\.\/useMediaQuery['"]/,
    'useMediaQuery export from index.ts missing'
  );
  assert.match(
    indexSource,
    /export\s*\{\s*usePrefersReducedMotion\s*\}\s*from\s*['"]\.\/usePrefersReducedMotion['"]/,
    'usePrefersReducedMotion export from index.ts missing'
  );
});

// 1.2 TiltCard Touch and Reduced Motion Guards
test('TiltCard: Touch & Coarse Pointer and Reduced Motion Guards', () => {
  const tiltCardSource = fs.readFileSync('src/components/ui/TiltCard.tsx', 'utf8');

  // Must import accessibility hooks
  assert.match(
    tiltCardSource,
    /usePrefersReducedMotion/,
    'usePrefersReducedMotion missing from TiltCard'
  );
  assert.match(tiltCardSource, /useMediaQuery/, 'useMediaQuery missing from TiltCard');

  // Must check coarse pointer and hover none
  assert.match(tiltCardSource, /\(pointer:\s*coarse\)/, 'pointer: coarse guard missing');
  assert.match(tiltCardSource, /\(hover:\s*none\)/, 'hover: none guard missing');

  // Guard variable must disable interactive tilt
  assert.match(
    tiltCardSource,
    /isInteractiveTiltDisabled\s*=\s*prefersReducedMotion\s*\|\|\s*isCoarsePointer\s*\|\|\s*isHoverNone/,
    'isInteractiveTiltDisabled invariant missing'
  );

  // Perspective and preserve-3d must be disabled on touch/reduced motion to avoid GPU layer overhead
  assert.match(
    tiltCardSource,
    /perspective:\s*isInteractiveTiltDisabled\s*\?\s*undefined\s*:\s*['"]1200px['"]/,
    'Perspective cleanup on touch missing'
  );
  assert.match(
    tiltCardSource,
    /transformStyle:\s*isInteractiveTiltDisabled\s*\?\s*undefined\s*:\s*['"]preserve-3d['"]/,
    'transformStyle cleanup on touch missing'
  );

  // Glare must not render when disabled
  assert.match(
    tiltCardSource,
    /glare\s*&&\s*!isInteractiveTiltDisabled/,
    'Glare disabled guard missing'
  );
});

// 1.3 MagneticButton Touch and Reduced Motion Guards
test('MagneticButton: Coarse Pointer & Reduced Motion Translation Bypass', () => {
  const magneticSource = fs.readFileSync('src/components/ui/MagneticButton.tsx', 'utf8');

  // Must import accessibility hooks
  assert.match(
    magneticSource,
    /usePrefersReducedMotion/,
    'usePrefersReducedMotion missing from MagneticButton'
  );
  assert.match(magneticSource, /useMediaQuery/, 'useMediaQuery missing from MagneticButton');

  // Must check coarse pointer and hover none
  assert.match(magneticSource, /\(pointer:\s*coarse\)/, 'pointer: coarse guard missing');
  assert.match(magneticSource, /\(hover:\s*none\)/, 'hover: none guard missing');

  // isMagneticDisabled logic
  assert.match(
    magneticSource,
    /isMagneticDisabled\s*=\s*prefersReducedMotion\s*\|\|\s*isCoarsePointer\s*\|\|\s*isHoverNone/,
    'isMagneticDisabled invariant missing'
  );

  // Position must animate to 0,0 when disabled
  assert.match(
    magneticSource,
    /animate=\{isMagneticDisabled\s*\?\s*\{\s*x:\s*0,\s*y:\s*0\s*\}\s*:\s*\{\s*x:\s*position\.x,\s*y:\s*position\.y\s*\}\}/,
    'Zero translation animate branch missing'
  );
});

// 1.4 TextReveal Reduced Motion Integration
test('TextReveal: Respects prefersReducedMotion with Instant Fallback', () => {
  const textRevealSource = fs.readFileSync('src/components/hero/TextReveal.tsx', 'utf8');
  assert.match(
    textRevealSource,
    /usePrefersReducedMotion/,
    'TextReveal must use usePrefersReducedMotion'
  );
  assert.match(
    textRevealSource,
    /staggerChildren:\s*prefersReducedMotion\s*\?\s*0\s*:\s*0\.04/,
    'Stagger must be 0 for reduced motion'
  );
  assert.match(
    textRevealSource,
    /charVariants\s*=\s*prefersReducedMotion/,
    'Instant charVariants for reduced motion missing'
  );
});

// 1.5 Fluid Typography and Touch Utilities in CSS
test('CSS Styles: Fluid Typography Utilities and Coarse Pointer Rules', () => {
  const premiumCss = fs.readFileSync('src/styles/premium.css', 'utf8');
  assert.match(
    premiumCss,
    /\.fluid-display\s*\{[\s\S]*?font-size:\s*clamp\(/,
    '.fluid-display clamp missing'
  );
  assert.match(
    premiumCss,
    /\.fluid-h1\s*\{[\s\S]*?font-size:\s*clamp\(/,
    '.fluid-h1 clamp missing'
  );
  assert.match(
    premiumCss,
    /\.fluid-h2\s*\{[\s\S]*?font-size:\s*clamp\(/,
    '.fluid-h2 clamp missing'
  );
  assert.match(
    premiumCss,
    /\.fluid-h3\s*\{[\s\S]*?font-size:\s*clamp\(/,
    '.fluid-h3 clamp missing'
  );
  assert.match(
    premiumCss,
    /@media\s*\(pointer:\s*coarse\),\s*\(hover:\s*none\)/,
    'Touch pointer guard media query missing from premium.css'
  );
  assert.match(
    premiumCss,
    /\.cursor-glow\s*\{[\s\S]*?display:\s*none\s*!important;/,
    'cursor-glow must hide on touch'
  );

  const globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
  assert.match(
    globalsCss,
    /\.safe-top\s*\{[\s\S]*?env\(safe-area-inset-top\)/,
    'safe-top utility missing'
  );
  assert.match(
    globalsCss,
    /\.safe-bottom\s*\{[\s\S]*?env\(safe-area-inset-bottom\)/,
    'safe-bottom utility missing'
  );
  assert.match(globalsCss, /\.gpu-accelerated/, 'gpu-accelerated utility missing');
});

// 1.6 HeroSection 320px Viewport Scaling and Button Responsiveness
test('HeroSection: 320px Viewport Safety, Fluid Heading, and Responsive Buttons', () => {
  const heroSource = fs.readFileSync('src/components/sections/HeroSection.tsx', 'utf8');

  // Clamp heading
  assert.match(
    heroSource,
    /text-\[clamp\(2\.5rem,7vw\+0\.75rem,5\.75rem\)\]/,
    'Fluid clamp() heading missing from HeroSection'
  );

  // Status badge bounded to 94vw on narrow screens
  assert.match(heroSource, /max-w-\[94vw\]/, 'max-w-[94vw] missing from Hero status badge');

  // CTA buttons flex-col on mobile, flex-row on sm+
  assert.match(
    heroSource,
    /flex\s+w-full[\s\S]*?flex-col\s+items-center\s+justify-center\s+gap-3[\s\S]*?sm:flex-row/,
    'Responsive CTA button stack missing'
  );
  assert.match(
    heroSource,
    /w-full[\s\S]*?sm:w-auto/,
    'w-full sm:w-auto missing from Hero CTA buttons'
  );
});

// -----------------------------------------------------------------------------
// MODULE 2: Performance, Dynamic Skeletons & Content-Visibility (Phase 11)
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 2: Performance, Dynamic Skeletons & Content-Visibility ---');

// 2.1 SectionSkeletons Completeness
test('SectionSkeletons: All 9 Below-the-Fold Sections Have Accessible Fallbacks', () => {
  assert.ok(
    fs.existsSync('src/components/ui/SectionSkeletons.tsx'),
    'SectionSkeletons.tsx missing'
  );
  const skeletonSource = fs.readFileSync('src/components/ui/SectionSkeletons.tsx', 'utf8');

  const expectedSkeletons = [
    'PathSelectionSkeleton',
    'AboutSkeleton',
    'ExperienceSkeleton',
    'EducationSkeleton',
    'AchievementsSkeleton',
    'ProjectsSkeleton',
    'SkillsSkeleton',
    'TriviaSkeleton',
    'ContactSkeleton',
  ];

  for (const skel of expectedSkeletons) {
    assert.match(
      skeletonSource,
      new RegExp(`export function ${skel}\\b`),
      `Missing skeleton export: ${skel}`
    );
  }

  // Must have pulse animation
  assert.match(skeletonSource, /animate-pulse/, 'animate-pulse missing from skeletons');
});

// 2.2 Page Lazy Loading Architecture with Skeletons
test('Page Layout: Dynamic Imports Wired with Dedicated Section Skeletons', () => {
  const pageSource = fs.readFileSync('src/app/page.tsx', 'utf8');

  // Skeletons must be imported
  assert.match(
    pageSource,
    /from ['"]@\/components\/ui\/SectionSkeletons['"]/,
    'SectionSkeletons import missing'
  );

  // Check each section is wired to its specific skeleton
  assert.match(
    pageSource,
    /AboutSection\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<AboutSkeleton\s*\/>/
  );
  assert.match(
    pageSource,
    /ExperienceSection\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<ExperienceSkeleton\s*\/>/
  );
  assert.match(
    pageSource,
    /EducationSection\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<EducationSkeleton\s*\/>/
  );
  assert.match(
    pageSource,
    /AchievementsSection\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<AchievementsSkeleton\s*\/>/
  );
  assert.match(
    pageSource,
    /ProjectsSection\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<ProjectsSkeleton\s*\/>/
  );
  assert.match(
    pageSource,
    /SkillsSection\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<SkillsSkeleton\s*\/>/
  );
  assert.match(
    pageSource,
    /TriviaGame\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<TriviaSkeleton\s*\/>/
  );
  assert.match(
    pageSource,
    /ContactSection\s*=\s*dynamic[\s\S]*?loading:\s*\(\)\s*=>\s*<ContactSkeleton\s*\/>/
  );

  // Hero is NOT dynamic (eager for LCP)
  assert.doesNotMatch(pageSource, /HeroSection\s*=\s*dynamic/, 'HeroSection must not be dynamic');
});

// 2.3 CSS content-visibility Optimization
test('CSS: content-visibility: auto Applied Strictly to Below-the-Fold Sections', () => {
  const globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');

  const expectedSections = [
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

  for (const id of expectedSections) {
    const regex = new RegExp(
      `#${id}\\s*\\{[\\s\\S]*?content-visibility:\\s*auto;[\\s\\S]*?contain-intrinsic-size:`
    );
    assert.match(globalsCss, regex, `content-visibility: auto missing for #${id}`);
  }

  // #hero MUST NOT have content-visibility (prevents LCP regression)
  assert.doesNotMatch(
    globalsCss,
    /#hero\s*\{[\s\S]*?content-visibility/,
    '#hero must not have content-visibility'
  );
});

// 2.4 HeroScene Anti-Lag and LCP Protection
test('HeroScene: Cached Bounding Rect, Loop Halting, and Deferred Initial Paint', () => {
  const heroSceneSource = fs.readFileSync('src/components/hero/HeroScene.tsx', 'utf8');

  // Cached rect
  assert.match(heroSceneSource, /cachedRect/, 'cachedRect missing from HeroScene');
  assert.match(heroSceneSource, /const updateRect\s*=/, 'updateRect missing from HeroScene');

  // Loop halting on !isVisible
  assert.match(heroSceneSource, /const startLoop\s*=/, 'startLoop missing from HeroScene');
  assert.match(heroSceneSource, /const stopLoop\s*=/, 'stopLoop missing from HeroScene');
  assert.match(heroSceneSource, /isRunning\s*=\s*false/, 'Loop halt on hidden missing');

  // contentvisibilityautostatechange support
  assert.match(
    heroSceneSource,
    /contentvisibilityautostatechange/,
    'contentvisibilityautostatechange listener missing'
  );

  // Deferred initialization
  assert.match(
    heroSceneSource,
    /setTimeout\(\s*\(\)\s*=>\s*\{[\s\S]*?startLoop\(\)/,
    'Deferred startLoop with setTimeout missing'
  );
});

// 2.5 SkillOrbit Visibility Loop Suspension
test('SkillOrbit: Halts Animation Loop When Offscreen', () => {
  const skillOrbitSource = fs.readFileSync('src/components/skills/SkillOrbit.tsx', 'utf8');

  assert.match(
    skillOrbitSource,
    /IntersectionObserver/,
    'IntersectionObserver missing from SkillOrbit'
  );
  assert.match(
    skillOrbitSource,
    /contentvisibilityautostatechange/,
    'contentvisibilityautostatechange missing from SkillOrbit'
  );
  assert.match(skillOrbitSource, /const startLoop\s*=/, 'startLoop missing from SkillOrbit');
  assert.match(skillOrbitSource, /const stopLoop\s*=/, 'stopLoop missing from SkillOrbit');
});

// -----------------------------------------------------------------------------
// MODULE 3: Semantic HTML, ARIA & JSON-LD SEO (Phase 12)
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 3: Semantic HTML, ARIA Tabs, Focus States & SEO ---');

// 3.1 ProjectsSection Semantic HTML & WAI-ARIA Tablist
test('ProjectsSection: <article>, WAI-ARIA Tablist, Roving Tabindex & Visible Focus', () => {
  const projectsSource = fs.readFileSync('src/components/sections/ProjectsSection.tsx', 'utf8');

  // Semantic HTML
  assert.match(projectsSource, /<motion\.article/, 'Cards must be <motion.article>');
  assert.match(
    projectsSource,
    /<header\s+className=["']mb-5/,
    '<header> tag missing from project card'
  );
  assert.match(
    projectsSource,
    /<footer\s+className=["']mt-8/,
    '<footer> tag missing from project card'
  );
  assert.match(
    projectsSource,
    /<ul[\s\S]*?aria-label=\{?["'`]Technologies used in/,
    '<ul> list missing for tech stack'
  );
  assert.match(projectsSource, /<li\s+key=\{tech\}/, '<li> item missing for tech tag');

  // WAI-ARIA Tabs
  assert.match(projectsSource, /role=["']tablist["']/, 'role="tablist" missing');
  assert.match(
    projectsSource,
    /aria-label=["']Project categories["']/,
    'aria-label missing on tablist'
  );
  assert.match(projectsSource, /role=["']tab["']/, 'role="tab" missing');
  assert.match(projectsSource, /aria-selected=\{isSelected\}/, 'aria-selected missing');
  assert.match(projectsSource, /aria-controls=["']projects-grid["']/, 'aria-controls missing');
  assert.match(projectsSource, /role=["']tabpanel["']/, 'role="tabpanel" missing on projects-grid');

  // Keyboard navigation & roving tabindex
  assert.match(projectsSource, /handleTabKeyDown/, 'handleTabKeyDown missing');
  assert.match(
    projectsSource,
    /tabIndex=\{isSelected\s*\?\s*0\s*:\s*-1\}/,
    'Roving tabindex missing'
  );

  // Case study button
  assert.match(
    projectsSource,
    /<button[\s\S]*?onClick=[\s\S]*?Click for Case Study ↗\s*<\/button>/,
    'Case study link must be an accessible button'
  );

  // Focus visible rings
  assert.match(
    projectsSource,
    /focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'focus-visible:ring-2 focus-visible:ring-blue-500 missing from action elements'
  );
});

// 3.2 ExperienceSection Semantic HTML
test('ExperienceSection: Semantic <article>, Hierarchical <h4>, and <time dateTime>', () => {
  const expSource = fs.readFileSync('src/components/sections/ExperienceSection.tsx', 'utf8');

  // Article tag
  assert.match(expSource, /<article\s+className=/, 'Career card must be <article>');

  // Hierarchical heading
  assert.match(
    expSource,
    /<h3[^>]*>[\s\S]*?\{exp\.role\}[\s\S]*?<\/h3>/,
    '<h3> role heading missing'
  );
  assert.match(
    expSource,
    /<h4[^>]*>[\s\S]*?\{exp\.company\}[\s\S]*?<\/h4>/,
    '<h4> company heading missing'
  );

  // Semantic <time dateTime="...">
  assert.match(expSource, /<time\s+dateTime=/, '<time dateTime="..."> tag missing');

  // Semantic <ul> / <li> lists
  assert.match(
    expSource,
    /<ul[\s\S]*?aria-label=\{?["'`]Key milestones and achievements/,
    'Achievement list <ul> missing'
  );
  assert.match(
    expSource,
    /<ul[\s\S]*?aria-label=\{?["'`]Technologies leveraged/,
    'Technologies list <ul> missing'
  );
  assert.match(
    expSource,
    /<footer\s+className=["']mt-6["']>/,
    '<footer> missing from experience card'
  );
});

// 3.3 AchievementsSection Semantic HTML
test('AchievementsSection: Semantic <article>, <header>, and <footer>', () => {
  const achieveSource = fs.readFileSync('src/components/sections/AchievementsSection.tsx', 'utf8');

  assert.match(achieveSource, /<motion\.article/, 'Achievement card must be <motion.article>');
  assert.match(achieveSource, /<header\s+className=["']mb-5/, '<header> tag missing');
  assert.match(
    achieveSource,
    /<h3[^>]*>[\s\S]*?\{item\.title\}[\s\S]*?<\/h3>/,
    '<h3> title missing'
  );
  assert.match(achieveSource, /<footer\s+className=["']mt-6/, '<footer> tag missing');
  assert.match(achieveSource, /Verified Credential/, 'Verified Credential status missing');
});

// 3.4 Interactive Elements Keyboard Focus States
test('Keyboard Navigation: Visible Focus Rings on Interactive Controls', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(
    navSource,
    /focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'focus-visible ring missing from Navigation'
  );

  const themeSource = fs.readFileSync('src/components/layout/ThemeProvider.tsx', 'utf8');
  assert.match(
    themeSource,
    /focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'focus-visible ring missing from ThemeToggle'
  );

  const pathSource = fs.readFileSync('src/components/sections/PathSelectionSection.tsx', 'utf8');
  assert.match(
    pathSource,
    /focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'focus-visible ring missing from PathSelection cards'
  );
});

// 3.5 SEO JSON-LD Person Schema and Metadata in layout.tsx
test('SEO & Structured Data: schema.org/Person JSON-LD and Canonical Metadata', () => {
  const layoutSource = fs.readFileSync('src/app/layout.tsx', 'utf8');

  // Metadata verification
  assert.match(
    layoutSource,
    /canonical:\s*['"]https:\/\/shaikrohit\.tech['"]/,
    'Canonical link missing from metadata'
  );
  assert.match(layoutSource, /type:\s*['"]profile['"]/, 'openGraph type must be profile');
  assert.match(layoutSource, /publisher:\s*['"]Shaik Rohit['"]/, 'publisher metadata missing');

  // JSON-LD Person schema verification
  assert.match(
    layoutSource,
    /<script\s+type=["']application\/ld\+json["']/,
    'application/ld+json script tag missing'
  );
  assert.match(layoutSource, /['"]@type['"]:\s*['"]Person['"]/, '@type: Person missing');
  assert.match(layoutSource, /['"]?name['"]?:\s*['"]Shaik Rohit['"]/, 'name: Shaik Rohit missing');
  assert.match(
    layoutSource,
    /Dr\.\s*Y\.C\.\s*James Yen Govt Polytechnic/,
    'alumniOf missing or incorrect'
  );
  assert.match(layoutSource, /Sithafal Technologies/, 'worksFor missing or incorrect');
  assert.match(layoutSource, /https:\/\/github\.com\/shaikrohit/, 'sameAs GitHub missing');
  assert.match(
    layoutSource,
    /https:\/\/www\.linkedin\.com\/in\/rohitshaik/,
    'sameAs LinkedIn missing'
  );
  assert.match(layoutSource, /knowsAbout/, 'knowsAbout array missing');
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
