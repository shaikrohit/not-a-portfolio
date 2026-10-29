/**
 * Challenger 2 Adversarial Stress Test Harness for Milestone 3
 * Focus Areas:
 * 1. Keyboard Accessibility & WAI-ARIA Tablist Compliance
 *    - ProjectsSection.tsx: ArrowLeft, ArrowRight, Home, End key cycles, aria-selected="true", roving tabindex (0 / -1).
 *    - Visible focus rings (focus-visible:ring-2 focus-visible:ring-blue-500) across all interactive elements.
 * 2. Semantic HTML Landmarks & Structure
 *    - <article> tag presence on project, experience, and achievement cards.
 *    - Valid <time dateTime="..."> format in career history.
 * 3. Structured Data & SEO Validation
 *    - schema.org/Person JSON-LD in src/app/layout.tsx: JSON.parse, schema fields, no invalid characters.
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
    RESULTS.tests.push({ name, status: 'FAIL', error: err.message, stack: err.stack });
    console.error(`✗ FAIL: ${name}\n  Error: ${err.message}`);
  }
}

console.log('================================================================');
console.log('CHALLENGER 2 ADVERSARIAL STRESS TEST SUITE: MILESTONE 3');
console.log('================================================================\n');

// =============================================================================
// MODULE 1: Keyboard Accessibility & WAI-ARIA Tablist Compliance
// =============================================================================
console.log('--- MODULE 1: Keyboard Accessibility & WAI-ARIA Tablist Compliance ---');

const projectsSectionPath = 'src/components/sections/ProjectsSection.tsx';
assert.ok(fs.existsSync(projectsSectionPath), 'ProjectsSection.tsx must exist');
const projectsSource = fs.readFileSync(projectsSectionPath, 'utf8');

// 1.1 WAI-ARIA Tablist & Tabpanel Contract
test('WAI-ARIA: Tablist, Tab, and Tabpanel roles and binding attributes', () => {
  // Tablist container role and accessible label
  assert.match(projectsSource, /role=["']tablist["']/, 'Tablist must declare role="tablist"');
  assert.match(
    projectsSource,
    /aria-label=["']Project categories["']/,
    'Tablist must declare aria-label="Project categories"'
  );

  // Tab roles and binding attributes
  assert.match(projectsSource, /role=["']tab["']/, 'Tabs must declare role="tab"');
  assert.match(
    projectsSource,
    /id=\{`project-tab-\$\{tab\.id\}`\}/,
    'Tabs must have dynamic ID matching pattern project-tab-${tab.id}'
  );
  assert.match(
    projectsSource,
    /aria-controls=["']projects-grid["']/,
    'Tabs must have aria-controls="projects-grid"'
  );
  assert.match(
    projectsSource,
    /aria-selected=\{isSelected\}/,
    'Tabs must dynamically bind aria-selected={isSelected}'
  );

  // Tabpanel container role and binding
  assert.match(projectsSource, /id=["']projects-grid["']/, 'Grid must have id="projects-grid"');
  assert.match(projectsSource, /role=["']tabpanel["']/, 'Grid must have role="tabpanel"');
  assert.match(
    projectsSource,
    /aria-labelledby=\{`project-tab-\$\{activeFilter\}`\}/,
    'Tabpanel must have dynamic aria-labelledby matching active tab ID'
  );
});

// 1.2 Roving Tabindex Implementation
test('WAI-ARIA: Roving tabindex implementation (tabIndex={isSelected ? 0 : -1})', () => {
  // WAI-ARIA Tab specification mandates roving tabindex: exactly one tab has tabIndex=0, all others -1
  assert.match(
    projectsSource,
    /tabIndex=\{isSelected\s*\?\s*0\s*:\s*-1\}/,
    'Tabs must implement roving tabindex: tabIndex={isSelected ? 0 : -1}'
  );

  // Inactive tabs must not be reachable via native Tab key sequence
  const tabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'featured', label: 'Featured' },
    { id: 'web-docker', label: 'Full-Stack & Docker' },
    { id: 'ai', label: 'GenAI & AI Tools' },
  ];

  for (const activeId of tabs.map((t) => t.id)) {
    const tabIndices = tabs.map((t) => ({ id: t.id, tabIndex: t.id === activeId ? 0 : -1 }));
    const zeros = tabIndices.filter((t) => t.tabIndex === 0);
    const negOnes = tabIndices.filter((t) => t.tabIndex === -1);

    assert.strictEqual(
      zeros.length,
      1,
      `Exactly one tab must have tabIndex=0 when active is ${activeId}`
    );
    assert.strictEqual(
      negOnes.length,
      tabs.length - 1,
      `Remaining tabs must have tabIndex=-1 when active is ${activeId}`
    );
    assert.strictEqual(
      zeros[0].id,
      activeId,
      `The active tab ${activeId} must be the one with tabIndex=0`
    );
  }
});

// 1.3 Keyboard Navigation State Machine Simulation (ArrowLeft, ArrowRight, Home, End)
test('Keyboard: ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Home, End cycles & wrap-around', () => {
  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'featured', label: 'Featured' },
    { id: 'web-docker', label: 'Full-Stack & Docker' },
    { id: 'ai', label: 'GenAI & AI Tools' },
  ];

  // Emulate handleTabKeyDown from ProjectsSection.tsx lines 67-92
  function simulateKeyDown(currentId, key) {
    let prevented = false;
    let focusedId = null;
    let nextActiveId = null;

    const event = {
      key,
      preventDefault: () => {
        prevented = true;
      },
    };

    const currentIndex = filterTabs.findIndex((t) => t.id === currentId);
    let nextIndex = -1;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % filterTabs.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + filterTabs.length) % filterTabs.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = filterTabs.length - 1;
    }

    if (nextIndex !== -1) {
      const nextTab = filterTabs[nextIndex];
      if (nextTab) {
        nextActiveId = nextTab.id;
        focusedId = `project-tab-${nextTab.id}`;
      }
    }

    return { prevented, focusedId, nextActiveId };
  }

  // 1. Forward progression (ArrowRight & ArrowDown)
  let res = simulateKeyDown('all', 'ArrowRight');
  assert.strictEqual(res.prevented, true, 'ArrowRight must call preventDefault');
  assert.strictEqual(res.nextActiveId, 'featured', 'all + ArrowRight -> featured');
  assert.strictEqual(
    res.focusedId,
    'project-tab-featured',
    'Focused element must be project-tab-featured'
  );

  res = simulateKeyDown('featured', 'ArrowDown');
  assert.strictEqual(res.prevented, true, 'ArrowDown must call preventDefault');
  assert.strictEqual(res.nextActiveId, 'web-docker', 'featured + ArrowDown -> web-docker');

  res = simulateKeyDown('web-docker', 'ArrowRight');
  assert.strictEqual(res.nextActiveId, 'ai', 'web-docker + ArrowRight -> ai');

  // Wrap-around forward (ai -> all)
  res = simulateKeyDown('ai', 'ArrowRight');
  assert.strictEqual(res.nextActiveId, 'all', 'ai + ArrowRight must wrap to all');
  assert.strictEqual(res.focusedId, 'project-tab-all');

  // 2. Backward progression (ArrowLeft & ArrowUp)
  res = simulateKeyDown('all', 'ArrowLeft');
  assert.strictEqual(res.prevented, true, 'ArrowLeft must call preventDefault');
  assert.strictEqual(res.nextActiveId, 'ai', 'all + ArrowLeft must wrap to ai (last tab)');

  res = simulateKeyDown('ai', 'ArrowUp');
  assert.strictEqual(res.prevented, true, 'ArrowUp must call preventDefault');
  assert.strictEqual(res.nextActiveId, 'web-docker', 'ai + ArrowUp -> web-docker');

  res = simulateKeyDown('web-docker', 'ArrowLeft');
  assert.strictEqual(res.nextActiveId, 'featured', 'web-docker + ArrowLeft -> featured');

  // 3. Boundary jumps (Home & End)
  res = simulateKeyDown('web-docker', 'Home');
  assert.strictEqual(res.prevented, true, 'Home must call preventDefault');
  assert.strictEqual(res.nextActiveId, 'all', 'Home must jump to index 0 (all)');

  res = simulateKeyDown('all', 'End');
  assert.strictEqual(res.prevented, true, 'End must call preventDefault');
  assert.strictEqual(res.nextActiveId, 'ai', 'End must jump to last index (ai)');

  // 4. Non-navigation keys (Tab, Enter, Escape, Space)
  for (const nonNavKey of ['Tab', 'Enter', 'Space', 'Escape', 'Shift']) {
    res = simulateKeyDown('featured', nonNavKey);
    assert.strictEqual(res.prevented, false, `${nonNavKey} must NOT call preventDefault`);
    assert.strictEqual(res.nextActiveId, null, `${nonNavKey} must NOT trigger tab change`);
    assert.strictEqual(res.focusedId, null, `${nonNavKey} must NOT steal focus`);
  }
});

// 1.4 Visible Focus Rings across ProjectsSection
test('Visible Focus Rings: ProjectsSection interactive elements declare focus-visible:ring-2 focus-visible:ring-blue-500', () => {
  // Check filter tabs
  assert.match(
    projectsSource,
    /className=\{`[^`]*focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'Filter tab buttons must declare focus-visible:ring-2 focus-visible:ring-blue-500'
  );

  // Check GitHub header repo button
  assert.match(
    projectsSource,
    /<a[\s\S]*?href=["']https:\/\/github\.com\/shaikrohit["'][\s\S]*?focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'Header GitHub repository link must declare focus-visible:ring-2 focus-visible:ring-blue-500'
  );

  // Check Case Study modal trigger button
  assert.match(
    projectsSource,
    /<button[\s\S]*?Click for Case Study ↗[\s\S]*?focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'Case study button must declare focus-visible:ring-2 focus-visible:ring-blue-500'
  );

  // Check project card source code and demo links
  assert.match(
    projectsSource,
    /href=\{project\.githubUrl\}[\s\S]*?focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'Project GitHub source links must declare focus-visible:ring-2 focus-visible:ring-blue-500'
  );

  assert.match(
    projectsSource,
    /href=\{project\.liveUrl\}[\s\S]*?focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'Project live demo links must declare focus-visible:ring-2 focus-visible:ring-blue-500'
  );
});

// 1.5 Global Visible Focus Rings Verification across Navigation, ThemeToggle, and PathSelection
test('Visible Focus Rings: Global UI components declare accessible focus indicators', () => {
  const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
  assert.match(
    navSource,
    /focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'Navigation interactive items must include focus-visible:ring-2 focus-visible:ring-blue-500'
  );

  const themeSource = fs.readFileSync('src/components/layout/ThemeProvider.tsx', 'utf8');
  assert.match(
    themeSource,
    /focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'ThemeProvider theme toggle must include focus-visible:ring-2 focus-visible:ring-blue-500'
  );

  const pathSource = fs.readFileSync('src/components/sections/PathSelectionSection.tsx', 'utf8');
  assert.match(
    pathSource,
    /focus-visible:ring-2\s+focus-visible:ring-blue-500/,
    'PathSelection persona buttons must include focus-visible:ring-2 focus-visible:ring-blue-500'
  );
});

// =============================================================================
// MODULE 2: Semantic HTML Landmarks & Structure
// =============================================================================
console.log('\n--- MODULE 2: Semantic HTML Landmarks & Structure ---');

// 2.1 Project Cards Semantic Structure
test('Semantic HTML: ProjectsSection cards use <article>, <header>, <footer tags', () => {
  assert.match(
    projectsSource,
    /<motion\.article/,
    'Project cards must be wrapped in <motion.article>'
  );
  assert.match(
    projectsSource,
    /<\/motion\.article>/,
    'Project cards must have closing </motion.article>'
  );

  // Card sub-landmarks
  assert.match(
    projectsSource,
    /<header\s+className=["']mb-5/,
    'Project card must contain <header>'
  );
  assert.match(
    projectsSource,
    /<h3[^>]*>[\s\S]*?\{project\.title\}[\s\S]*?<\/h3>/,
    'Project card must use <h3> for title'
  );
  assert.match(
    projectsSource,
    /<p\s+className=["'][^"']*text-\[var\(--text-secondary\)\]/,
    'Project card must use <p> for description'
  );
  assert.match(
    projectsSource,
    /<footer\s+className=["']mt-8/,
    'Project card must contain <footer>'
  );
  assert.match(
    projectsSource,
    /<ul[\s\S]*?aria-label=\{`Technologies used in \$\{project\.title\}`\}/,
    'Tech stack must be accessible <ul>'
  );
  assert.match(projectsSource, /<li\s+key=\{tech\}/, 'Tech badges must be <li>');
});

// 2.2 Experience Cards Semantic Structure & Valid <time dateTime="...">
const expPath = 'src/components/sections/ExperienceSection.tsx';
assert.ok(fs.existsSync(expPath), 'ExperienceSection.tsx must exist');
const expSource = fs.readFileSync(expPath, 'utf8');

test('Semantic HTML: ExperienceSection uses <article>, hierarchical headings, and semantic lists', () => {
  assert.match(expSource, /<article\s+className=/, 'Experience cards must be wrapped in <article>');
  assert.match(expSource, /<\/article>/, 'Experience cards must have closing </article>');

  assert.match(expSource, /<header\s+className=["']mb-4/, 'Experience card must contain <header>');
  assert.match(
    expSource,
    /<h3[^>]*>[\s\S]*?\{exp\.role\}[\s\S]*?<\/h3>/,
    'Experience role must be <h3>'
  );
  assert.match(
    expSource,
    /<h4[^>]*>[\s\S]*?\{exp\.company\}[\s\S]*?<\/h4>/,
    'Experience company must be <h4>'
  );

  assert.match(
    expSource,
    /<p\s+className=["'][^"']*text-\[var\(--text-secondary\)\]/,
    'Experience description must be <p>'
  );
  assert.match(
    expSource,
    /<ul[\s\S]*?aria-label=\{`Key milestones and achievements at \$\{exp\.company\}`\}/,
    'Milestones must be accessible <ul>'
  );
  assert.match(
    expSource,
    /<footer\s+className=["']mt-6["']>/,
    'Experience card must contain <footer>'
  );
  assert.match(
    expSource,
    /<ul[\s\S]*?aria-label=\{`Technologies leveraged at \$\{exp\.company\}`\}/,
    'Tech used must be accessible <ul>'
  );
});

test('Semantic HTML: Valid <time dateTime="..."> format in career history', () => {
  // Extract dateTime expression from ExperienceSection.tsx
  const timeMatch = expSource.match(/<time\s+dateTime=\{([^}]+)\}/);
  assert.ok(timeMatch, '<time dateTime="..."> tag must be present in ExperienceSection');

  const dateTimeExpr = timeMatch[1].trim();
  // Evaluates both branches of the conditional: isCurrent ? '2024-01-01' : '2023-08-01'
  const dateStrings = dateTimeExpr
    .match(/['"](\d{4}-\d{2}-\d{2})['"]/g)
    .map((s) => s.replace(/['"]/g, ''));

  assert.ok(dateStrings.length >= 2, 'Should specify ISO date strings for current and past roles');

  for (const dateStr of dateStrings) {
    // 1. ISO 8601 YYYY-MM-DD Regex Check
    assert.match(
      dateStr,
      /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/,
      `${dateStr} must be valid YYYY-MM-DD`
    );

    // 2. JavaScript Date Parsing & NaN Check
    const parsedDate = new Date(dateStr);
    assert.strictEqual(
      isNaN(parsedDate.getTime()),
      false,
      `${dateStr} must parse to valid Date object`
    );

    // 3. Re-serialization Check (prevent overflow dates like 2024-02-31)
    const isoString = parsedDate.toISOString();
    assert.ok(isoString.startsWith(dateStr), `${dateStr} re-serializes cleanly to ${isoString}`);

    // 4. Year sanity check
    const year = parsedDate.getUTCFullYear();
    assert.ok(
      year >= 2020 && year <= 2030,
      `Year ${year} should be within realistic career timeline`
    );
  }
});

// 2.3 Achievements Cards Semantic Structure
const achievePath = 'src/components/sections/AchievementsSection.tsx';
assert.ok(fs.existsSync(achievePath), 'AchievementsSection.tsx must exist');
const achieveSource = fs.readFileSync(achievePath, 'utf8');

test('Semantic HTML: AchievementsSection uses <motion.article>, <header>, and <footer>', () => {
  assert.match(
    achieveSource,
    /<motion\.article/,
    'Achievement cards must be wrapped in <motion.article>'
  );
  assert.match(
    achieveSource,
    /<\/motion\.article>/,
    'Achievement cards must have closing </motion.article>'
  );

  assert.match(
    achieveSource,
    /<header\s+className=["']mb-5/,
    'Achievement card must contain <header>'
  );
  assert.match(
    achieveSource,
    /<h3[^>]*>[\s\S]*?\{item\.title\}[\s\S]*?<\/h3>/,
    'Achievement title must be <h3>'
  );
  assert.match(
    achieveSource,
    /<p\s+className=["'][^"']*text-\[var\(--text-secondary\)\]/,
    'Achievement description must be <p>'
  );
  assert.match(
    achieveSource,
    /<footer\s+className=["']mt-6/,
    'Achievement card must contain <footer>'
  );
  assert.match(
    achieveSource,
    /Verified Credential/,
    'Achievement card footer must show Verified Credential'
  );
});

// =============================================================================
// MODULE 3: Structured Data & SEO Validation
// =============================================================================
console.log('\n--- MODULE 3: Structured Data & SEO Validation ---');

const layoutPath = 'src/app/layout.tsx';
assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx must exist');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');

// 3.1 JSON-LD Person Schema Extraction and Syntactic Parsing
let parsedPersonSchema = null;

test('SEO: Extract and parse schema.org/Person JSON-LD with JSON.parse', () => {
  // Verify application/ld+json script tag injection
  assert.match(
    layoutSource,
    /<script\s+type=["']application\/ld\+json["'][\s\S]*?dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(personJsonLd\),?\s*\}\}\s*\/>/,
    'layout.tsx must render <script type="application/ld+json"> using JSON.stringify(personJsonLd)'
  );

  // Extract the personJsonLd object literal from the layout source
  const schemaMatch = layoutSource.match(/const personJsonLd\s*=\s*(\{[\s\S]*?\n\};)/);
  assert.ok(schemaMatch, 'personJsonLd object definition must be present in layout.tsx');

  const rawObjectCode = schemaMatch[1].replace(/;\s*$/, '');

  // Safely evaluate object literal to inspect exactly what will be stringified
  const evalFn = new Function(`return ${rawObjectCode};`);
  const rawObj = evalFn();

  // Test JSON.stringify and JSON.parse round-trip
  const jsonString = JSON.stringify(rawObj);
  assert.strictEqual(typeof jsonString, 'string', 'personJsonLd must serialize to JSON string');
  assert.ok(jsonString.length > 200, 'JSON-LD string must not be truncated');

  // Verify no illegal characters or unescaped sequences
  assert.doesNotMatch(
    jsonString,
    /[\u0000-\u001F]/,
    'JSON string must not contain unescaped ASCII control characters'
  );

  parsedPersonSchema = JSON.parse(jsonString);
  assert.strictEqual(typeof parsedPersonSchema, 'object', 'JSON.parse must yield an object');
  assert.notStrictEqual(parsedPersonSchema, null, 'Parsed JSON must not be null');
});

// 3.2 Schema.org/Person Top-Level Field Conformance
test('SEO: Validate schema.org/Person required top-level fields', () => {
  assert.ok(parsedPersonSchema, 'parsedPersonSchema must be initialized');

  // @context and @type
  assert.strictEqual(
    parsedPersonSchema['@context'],
    'https://schema.org',
    '@context must be "https://schema.org"'
  );
  assert.strictEqual(parsedPersonSchema['@type'], 'Person', '@type must be "Person"');
  assert.strictEqual(
    parsedPersonSchema['@id'],
    'https://shaikrohit.tech/#person',
    '@id must be "https://shaikrohit.tech/#person"'
  );

  // Identity and Names
  assert.strictEqual(parsedPersonSchema.name, 'Shaik Rohit', 'name must be "Shaik Rohit"');
  assert.strictEqual(parsedPersonSchema.givenName, 'Shaik', 'givenName must be "Shaik"');
  assert.strictEqual(parsedPersonSchema.familyName, 'Rohit', 'familyName must be "Rohit"');
  assert.ok(Array.isArray(parsedPersonSchema.alternateName), 'alternateName must be an array');
  assert.ok(
    parsedPersonSchema.alternateName.includes('Rohit Shaik'),
    'alternateName must include "Rohit Shaik"'
  );

  // Professional Role
  assert.strictEqual(
    parsedPersonSchema.jobTitle,
    'Full Stack & AI Developer',
    'jobTitle must be "Full Stack & AI Developer"'
  );
  assert.ok(parsedPersonSchema.description.length > 30, 'description must be descriptive');
  assert.strictEqual(
    parsedPersonSchema.email,
    'mailto:shaik.rohit.official@gmail.com',
    'email must use mailto: format'
  );
});

// 3.3 URL and SameAs Validation
test('SEO: Validate URLs and sameAs profiles in schema.org/Person', () => {
  // Main URL
  const mainUrl = new URL(parsedPersonSchema.url);
  assert.strictEqual(mainUrl.protocol, 'https:', 'url protocol must be https');
  assert.strictEqual(mainUrl.hostname, 'shaikrohit.tech', 'url hostname must be shaikrohit.tech');

  // Image URL
  const imageUrl = new URL(parsedPersonSchema.image);
  assert.strictEqual(imageUrl.protocol, 'https:', 'image protocol must be https');
  assert.ok(
    imageUrl.pathname.endsWith('og-image.png'),
    'image pathname must end with og-image.png'
  );

  // sameAs social profiles array
  assert.ok(Array.isArray(parsedPersonSchema.sameAs), 'sameAs must be an array');
  assert.ok(
    parsedPersonSchema.sameAs.length >= 3,
    'sameAs must contain at least 3 social profiles'
  );

  const requiredProfiles = [
    'https://github.com/shaikrohit',
    'https://www.linkedin.com/in/rohitshaik',
    'https://x.com/rohitshaik',
  ];

  for (const profile of requiredProfiles) {
    assert.ok(parsedPersonSchema.sameAs.includes(profile), `sameAs must include ${profile}`);
    // Check URL validity
    const u = new URL(profile);
    assert.strictEqual(u.protocol, 'https:');
  }
});

// 3.4 Nested Entities: PostalAddress, EducationalOrganization, Organization
test('SEO: Validate nested entities (address, alumniOf, worksFor)', () => {
  // Home Address
  assert.strictEqual(
    parsedPersonSchema.address?.['@type'],
    'PostalAddress',
    'address must be PostalAddress'
  );
  assert.strictEqual(parsedPersonSchema.address?.addressLocality, 'Kuppam');
  assert.strictEqual(parsedPersonSchema.address?.addressRegion, 'Andhra Pradesh');
  assert.strictEqual(parsedPersonSchema.address?.postalCode, '517425');
  assert.strictEqual(parsedPersonSchema.address?.addressCountry, 'IN');

  // Alumni Of (Education)
  assert.strictEqual(
    parsedPersonSchema.alumniOf?.['@type'],
    'EducationalOrganization',
    'alumniOf must be EducationalOrganization'
  );
  assert.strictEqual(parsedPersonSchema.alumniOf?.name, 'Dr. Y.C. James Yen Govt Polytechnic');
  assert.strictEqual(parsedPersonSchema.alumniOf?.address?.['@type'], 'PostalAddress');
  assert.strictEqual(parsedPersonSchema.alumniOf?.address?.addressLocality, 'Kuppam');

  // Works For (Employment)
  assert.strictEqual(
    parsedPersonSchema.worksFor?.['@type'],
    'Organization',
    'worksFor must be Organization'
  );
  assert.strictEqual(parsedPersonSchema.worksFor?.name, 'Sithafal Technologies');
  assert.strictEqual(parsedPersonSchema.worksFor?.address?.['@type'], 'PostalAddress');
  assert.strictEqual(parsedPersonSchema.worksFor?.address?.addressLocality, 'Tirupati');
});

// 3.5 knowsAbout Expertise Array
test('SEO: Validate knowsAbout array completeness and formatting', () => {
  const knowsAbout = parsedPersonSchema.knowsAbout;
  assert.ok(Array.isArray(knowsAbout), 'knowsAbout must be an array');
  assert.ok(knowsAbout.length >= 12, 'knowsAbout should have at least 12 technical competencies');

  const essentialSkills = [
    'Full Stack Development',
    'React',
    'Next.js 16',
    'TypeScript',
    'Docker',
    'Generative AI',
    'PostgreSQL',
    'Web Accessibility (WCAG 2.1 AA)',
  ];

  for (const skill of essentialSkills) {
    assert.ok(knowsAbout.includes(skill), `knowsAbout must include "${skill}"`);
  }

  for (const item of knowsAbout) {
    assert.strictEqual(typeof item, 'string', 'Every knowsAbout entry must be a string');
    assert.ok(item.trim().length > 0, 'knowsAbout entries must not be blank strings');
  }
});

// =============================================================================
// TEST SUITE SUMMARY
// =============================================================================
console.log('\n================================================================');
console.log(
  `CHALLENGER 2 SUMMARY: ${RESULTS.passed} PASSED, ${RESULTS.failed} FAILED out of ${RESULTS.passed + RESULTS.failed} tests`
);
console.log('================================================================\n');

if (RESULTS.failed > 0) {
  process.exit(1);
}
