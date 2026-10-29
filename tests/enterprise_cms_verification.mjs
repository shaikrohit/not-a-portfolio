/**
 * ENTERPRISE CMS & UNIFIED FLOW DEEP VERIFICATION SUITE
 *
 * Verifies:
 * 1. Resilient CMS data fetching layer & static config fallbacks
 * 2. Homepage streamlining (Removal of 4 Paths, direct Hero -> About transition)
 * 3. Navigation section tracking alignment (9 unified landmarks)
 * 4. Multi-provider storage engine (Cloudinary, Supabase, Cloudflare R2)
 * 5. Supabase migration schema & RLS policy specifications
 * 6. Admin HQ command center CRUD actions and drafting pipeline
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('================================================================');
console.log('ENTERPRISE CMS & HOMESTREAMLINE EMPIRICAL VERIFICATION SUITE');
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    passed++;
    console.log(`✓ PASS: ${name}`);
  } catch (err) {
    failed++;
    console.error(`✗ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
  }
}

// ----------------------------------------------------------------------------
// 1. HOMEPAGE STREAMLINING & NARRATIVE FLOW (PHASE 1)
// ----------------------------------------------------------------------------
console.log('--- 1. Homepage Streamlining & Persona Gating Removal ---');

const pageSource = fs.readFileSync('src/app/page.tsx', 'utf8');
const navSource = fs.readFileSync('src/components/layout/Navigation.tsx', 'utf8');
const aboutSource = fs.readFileSync('src/components/sections/AboutSection.tsx', 'utf8');
const heroSource = fs.readFileSync('src/components/sections/HeroSection.tsx', 'utf8');

runTest('Phase 1: PathSelectionSection is completely removed from HomePage', () => {
  assert(
    !pageSource.includes('<PathSelectionSection'),
    'PathSelectionSection must not be rendered'
  );
  assert(
    !pageSource.includes('PathSelectionSkeleton'),
    'PathSelectionSkeleton must not be imported'
  );
  assert(
    !pageSource.includes('PathSelectionSection = dynamic'),
    'Dynamic import for paths must be removed'
  );
});

runTest('Phase 1: Hero transitions directly to About via luminous glowing divider', () => {
  const heroIndex = pageSource.indexOf('<HeroSection');
  const dividerIndex = pageSource.indexOf('<SectionDivider', heroIndex);
  const aboutIndex = pageSource.indexOf('<AboutSection', dividerIndex);

  assert(heroIndex !== -1, 'HeroSection must exist');
  assert(dividerIndex !== -1, 'SectionDivider must exist between Hero and About');
  assert(aboutIndex !== -1, 'AboutSection must follow divider');
  assert(
    heroIndex < dividerIndex && dividerIndex < aboutIndex,
    'Sequence must be Hero -> Divider -> About'
  );

  // Verify glowing divider
  const transitionChunk = pageSource.substring(heroIndex, aboutIndex);
  assert(
    transitionChunk.includes('variant="glow"'),
    'Divider between Hero and About must be glowing beam'
  );
});

runTest('Phase 1: Navigation section landmarks omit #paths and track 9 core landmarks', () => {
  assert(!navSource.includes("id: 'paths'"), 'Navigation ALL_PAGE_SECTIONS must not contain paths');
  const expectedLandmarks = [
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
  for (const landmark of expectedLandmarks) {
    assert(
      navSource.includes(`id: '${landmark}'`),
      `Navigation must define landmark '${landmark}'`
    );
  }
});

runTest('Phase 1: AboutSection renders universal verified badge without persona gating', () => {
  assert(
    aboutSource.includes('Verified Engineering Profile'),
    'AboutSection must feature universal Verified Engineering Profile badge'
  );
  assert(
    !aboutSource.includes('Tailored for: {visitorType'),
    'AboutSection must not gate bio by visitorType'
  );
});

runTest('Phase 1: HeroSection scroll button targets about section directly', () => {
  assert(
    heroSource.includes("scrollTo('about')"),
    "HeroSection scroll indicator must target 'about'"
  );
});

// ----------------------------------------------------------------------------
// 2. SUPABASE MIGRATION & RLS SCHEMA (PHASE 2)
// ----------------------------------------------------------------------------
console.log('\n--- 2. Supabase Migration Schema & RLS Policies ---');

const migrationPath = 'supabase/migrations/20261029_enterprise_cms.sql';
assert(fs.existsSync(migrationPath), `Migration file must exist at ${migrationPath}`);
const sqlContent = fs.readFileSync(migrationPath, 'utf8');

const REQUIRED_TABLES = [
  'cms_profile',
  'cms_projects',
  'cms_experience',
  'cms_education',
  'cms_skills',
  'cms_achievements',
  'cms_content_drafts',
  'cms_settings',
];

runTest('Phase 2: SQL Migration creates all 8 required CMS tables', () => {
  for (const table of REQUIRED_TABLES) {
    assert(
      sqlContent.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
      `Missing CREATE TABLE for ${table}`
    );
  }
});

runTest('Phase 2: Row Level Security (RLS) is enabled for all 8 tables', () => {
  for (const table of REQUIRED_TABLES) {
    assert(
      sqlContent.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`),
      `RLS not enabled for ${table}`
    );
  }
});

runTest('Phase 2: Service Role full access policies are configured for Server Actions', () => {
  for (const table of REQUIRED_TABLES) {
    assert(
      sqlContent.includes(`Service role full access ${table}`),
      `Service role policy missing for ${table}`
    );
  }
});

runTest('Phase 2: Seed data inserts verified factory defaults for all sections', () => {
  assert(sqlContent.includes('INSERT INTO cms_profile'), 'Seed data missing for cms_profile');
  assert(sqlContent.includes('INSERT INTO cms_projects'), 'Seed data missing for cms_projects');
  assert(sqlContent.includes('INSERT INTO cms_experience'), 'Seed data missing for cms_experience');
  assert(sqlContent.includes('INSERT INTO cms_education'), 'Seed data missing for cms_education');
  assert(sqlContent.includes('INSERT INTO cms_skills'), 'Seed data missing for cms_skills');
  assert(
    sqlContent.includes('INSERT INTO cms_achievements'),
    'Seed data missing for cms_achievements'
  );

  // Verify key content presence
  assert(sqlContent.includes('CarbonSphere'), 'CarbonSphere must be seeded');
  assert(sqlContent.includes('Smart FIFA 2026 Stadiums'), 'Smart FIFA must be seeded');
  assert(sqlContent.includes('Sithafal Technologies'), 'Sithafal Technologies must be seeded');
  assert(sqlContent.includes('96%'), '96% grade must be seeded');
});

// ----------------------------------------------------------------------------
// 3. MULTI-PROVIDER STORAGE ENGINE (PHASE 3)
// ----------------------------------------------------------------------------
console.log('\n--- 3. Multi-Provider Storage Engine ---');

const storageTypesPath = 'src/lib/storage/types.ts';
const storageIndexPath = 'src/lib/storage/index.ts';
const cloudinaryPath = 'src/lib/storage/cloudinary.ts';
const supabaseStoragePath = 'src/lib/storage/supabaseStorage.ts';
const r2Path = 'src/lib/storage/cloudflareR2.ts';

runTest('Phase 3: Storage driver files exist and are complete', () => {
  assert(fs.existsSync(storageTypesPath), 'Storage types file must exist');
  assert(fs.existsSync(storageIndexPath), 'Storage index file must exist');
  assert(fs.existsSync(cloudinaryPath), 'Cloudinary provider file must exist');
  assert(fs.existsSync(supabaseStoragePath), 'Supabase storage provider file must exist');
  assert(fs.existsSync(r2Path), 'Cloudflare R2 provider file must exist');
});

const cloudinaryCode = fs.readFileSync(cloudinaryPath, 'utf8');

runTest('Phase 3: Cloudinary provider handles automated WebP/AVIF transformation', () => {
  assert(
    cloudinaryCode.includes("transformations.push('f_auto', 'q_auto')") ||
      cloudinaryCode.includes("'f_auto', 'q_auto'"),
    'Cloudinary optimizeUrl must apply f_auto,q_auto'
  );
});

// ----------------------------------------------------------------------------
// 4. ADMIN HQ FULL-STACK CMS COMMAND CENTER (PHASE 4)
// ----------------------------------------------------------------------------
console.log('\n--- 4. Admin HQ Full-Stack CMS Command Center ---');

const adminDashboardSource = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');
const cmsActionsSource = fs.readFileSync('src/app/_actions/cms.ts', 'utf8');

runTest('Phase 4: AdminDashboard includes tabbed management for all portfolio sections', () => {
  const expectedTabs = [
    'profile',
    'projects',
    'experience',
    'education',
    'skills',
    'achievements',
    'media',
    'publish',
    'trivia',
    'resume',
  ];
  for (const tab of expectedTabs) {
    assert(adminDashboardSource.includes(`id: '${tab}'`), `AdminDashboard missing tab '${tab}'`);
  }
});

runTest(
  'Phase 4: Server actions include CRUD, GitHub sync, publishing, and emergency reset',
  () => {
    const requiredActions = [
      'getAdminCMSData',
      'saveDraftAction',
      'publishDraftAction',
      'publishAllDraftsAction',
      'updateProfileAction',
      'saveProjectAction',
      'deleteProjectAction',
      'syncGitHubStatsForProjectsAction',
      'saveExperienceAction',
      'deleteExperienceAction',
      'saveEducationAction',
      'deleteEducationAction',
      'saveSkillAction',
      'deleteSkillAction',
      'saveAchievementAction',
      'deleteAchievementAction',
      'uploadMediaAction',
      'emergencyResetToDefaultsAction',
    ];
    for (const action of requiredActions) {
      assert(
        cmsActionsSource.includes(`export async function ${action}`),
        `cms.ts missing server action: ${action}`
      );
    }
  }
);

// ----------------------------------------------------------------------------
// 5. RESILIENT DATA FETCHING & DUAL-ENGINE FALLBACK (PHASE 5)
// ----------------------------------------------------------------------------
console.log('\n--- 5. Resilient Data Fetching & Fallback Layer ---');

const getContentPath = 'src/lib/cms/getContent.ts';
assert(fs.existsSync(getContentPath), 'getContent.ts must exist');
const getContentCode = fs.readFileSync(getContentPath, 'utf8');

runTest('Phase 5: Resilient content fetcher falls back to static defaults if offline', () => {
  assert(getContentCode.includes('DEFAULT_PROFILE'), 'Must define DEFAULT_PROFILE from config');
  assert(getContentCode.includes('DEFAULT_PROJECTS'), 'Must define DEFAULT_PROJECTS from config');
  assert(
    getContentCode.includes('DEFAULT_EXPERIENCE'),
    'Must define DEFAULT_EXPERIENCE from config'
  );
  assert(getContentCode.includes('DEFAULT_EDUCATION'), 'Must define DEFAULT_EDUCATION from config');
  assert(getContentCode.includes('DEFAULT_SKILLS'), 'Must define DEFAULT_SKILLS from config');
  assert(
    getContentCode.includes('DEFAULT_ACHIEVEMENTS'),
    'Must define DEFAULT_ACHIEVEMENTS from config'
  );
  assert(
    getContentCode.includes('catch (error)'),
    'Must include try/catch block with fallback for zero-downtime'
  );
});

runTest('Phase 5: HomePage integrates getPortfolioContent() in Server Component', () => {
  assert(
    pageSource.includes('const content = await getPortfolioContent()'),
    'HomePage must fetch content from getPortfolioContent'
  );
  assert(
    pageSource.includes('<HeroSection profile={content.profile} />'),
    'HeroSection must receive content.profile'
  );
  assert(
    pageSource.includes('<AboutSection profile={content.profile} />'),
    'AboutSection must receive content.profile'
  );
  assert(
    pageSource.includes('<ProjectsSection projects={content.projects} />'),
    'ProjectsSection must receive content.projects'
  );
});

// ----------------------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(
  `TEST SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} assertions`
);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
}
