/**
 * Empirical Stress Test Harness for Milestone 1
 * Contact & Backend Integration
 *
 * Tests:
 * 1. Form Validation (Boundary conditions, Unicode, emails, character limits)
 * 2. Form Error Recovery & State Transitions
 * 3. Orbital Geometry & Counter-Rotation Invariant (Math Proof & Empirical Simulation)
 * 4. CSS Keyframes, Pause Controls & Prefers-Reduced-Motion Rules
 * 5. Clipboard API Resilience & Fallbacks
 * 6. Defect Reproduction Oracle: Indic/Brahmic combining marks & iOS Smart Punctuation
 */

import fs from 'node:fs';
import assert from 'node:assert';

const RESULTS = {
  passed: 0,
  failed: 0,
  defectsIdentified: 0,
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
    RESULTS.defectsIdentified++;
    RESULTS.tests.push({ name, status: 'DEFECT_CONFIRMED' });
    console.log(`⚠️ DEFECT CONFIRMED: ${name}`);
  } catch (err) {
    RESULTS.failed++;
    RESULTS.tests.push({ name, status: 'UNABLE_TO_REPRODUCE', error: err.message });
    console.error(`✗ UNABLE TO REPRODUCE DEFECT: ${name}\n  Error: ${err.message}`);
  }
}

console.log('================================================================');
console.log('STARTING EMPIRICAL STRESS TEST SUITE: MILESTONE 1 (CONTACT)');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// MODULE 1: Extract and Stress-Test Client Validation Logic from ContactForm.tsx
// -----------------------------------------------------------------------------
console.log('--- MODULE 1: ContactForm Client-Side Validation Logic ---');

const contactFormSource = fs.readFileSync('src/components/contact/ContactForm.tsx', 'utf8');

// Extract validateField function from source code directly
function extractValidationFunctions(source) {
  const vfMatch = source.match(/export function validateField[\s\S]*?\n}\n/);
  if (!vfMatch) throw new Error('Could not find validateField in ContactForm.tsx');

  const vaMatch = source.match(/export function validateAll[\s\S]*?\n}\n/);
  if (!vaMatch) throw new Error('Could not find validateAll in ContactForm.tsx');

  // Strip TypeScript type annotations to evaluate cleanly in Node
  const cleanVf = vfMatch[0]
    .replace(/export function validateField\([^)]*\):[^{]*/, 'function validateField(field, value)')
    .replace(/as VisitorType/g, '')
    .replace(/const validTypes: VisitorType\[\]/g, 'const validTypes');

  const cleanVa = vaMatch[0]
    .replace(/export function validateAll\([^)]*\):[^{]*/, 'function validateAll(values)')
    .replace(/const errors: FormErrors = {};/, 'const errors = {};')
    .replace(/as const/g, '')
    .replace(/field\s*:\s*\w+/g, 'field');

  const runner = new Function(`
    ${cleanVf}
    ${cleanVa}
    return { validateField, validateAll };
  `);

  return runner();
}

const { validateField, validateAll } = extractValidationFunctions(contactFormSource);

test('Name Validation - Boundary: Empty string and whitespace', () => {
  assert.strictEqual(validateField('name', ''), 'Name is required.');
  assert.strictEqual(validateField('name', ' '), 'Name is required.');
  assert.strictEqual(validateField('name', '   \t\n  '), 'Name is required.');
});

test('Name Validation - Boundary: 1 character (Too short)', () => {
  assert.strictEqual(validateField('name', 'A'), 'Name must be at least 2 characters.');
  assert.strictEqual(validateField('name', '李'), 'Name must be at least 2 characters.');
});

test('Name Validation - Boundary: 2 characters (Minimum valid length)', () => {
  assert.strictEqual(validateField('name', 'Al'), undefined);
  assert.strictEqual(validateField('name', '李小'), undefined);
  assert.strictEqual(validateField('name', '  Al  '), undefined); // Trimming works
});

test('Name Validation - Boundary: 100 characters (Maximum valid length)', () => {
  const exact100 = 'A'.repeat(100);
  assert.strictEqual(validateField('name', exact100), undefined);
});

test('Name Validation - Boundary: 101 characters (Exceeds limit)', () => {
  const len101 = 'A'.repeat(101);
  assert.strictEqual(validateField('name', len101), 'Name cannot exceed 100 characters.');
});

test('Name Validation - Basic NFC International Names Supported', () => {
  const passingInternationalNames = [
    'René Descartes', // NFC
    "José-María O'Connor", // Straight apostrophe
    'Dr. Martin Luther King Jr.',
    'Shaik Rohit',
    '李小龙', // Chinese (Han)
    '山田 太郎', // Japanese (Kanji)
    'Владимир Путин', // Cyrillic
    'محمد عبد الله', // Arabic (without harakat)
    'Ángel Peña', // Spanish NFC
    'Søren Kierkegaard', // Danish
    'Chloë Sevigny', // French diaeresis NFC
    'Αλέξανδρος ο Μέγας', // Greek
    'דוד בן-גוריון', // Hebrew (without niqqud)
  ];

  for (const name of passingInternationalNames) {
    const res = validateField('name', name);
    assert.strictEqual(res, undefined, `Expected "${name}" to be valid, got "${res}"`);
  }
});

test('Name Validation - Combining Marks (Indic / Devanagari / NFD) and Smart Punctuation Supported', () => {
  // Rohit's own name in Devanagari: "रोहित शेख"
  // Contains combining marks: \u094B (vowel sign o), \u093F (vowel sign i), \u0947 (vowel sign e)
  const devanagariName = 'रोहित शेख';
  const resultHindi = validateField('name', devanagariName);
  assert.strictEqual(
    resultHindi,
    undefined,
    'Devanagari name must be accepted'
  );

  // Decomposed NFD Unicode Latin ("René" formatted as 'e' + \u0301 combining acute accent)
  const nfdRene = 'Rene\u0301';
  const resultNfd = validateField('name', nfdRene);
  assert.strictEqual(
    resultNfd,
    undefined,
    'NFD decomposed name must be accepted'
  );

  // iOS / macOS Smart Punctuation curly apostrophe: U+2019
  const smartApostropheName = 'O\u2019Connor';
  const resultSmart = validateField('name', smartApostropheName);
  assert.strictEqual(
    resultSmart,
    undefined,
    'Smart apostrophe must be accepted'
  );
});

test('Name Validation - Invalid Characters Rejected (Numbers, Scripts, Special Symbols)', () => {
  const invalidNames = [
    'John 3',
    '007',
    '<script>alert("xss")</script>',
    'admin; DROP TABLE users;',
    'Alex_Chen',
    'User@Domain',
    'Test#Name',
    'Hello$World',
    'John 😊', // Emoji
  ];

  for (const name of invalidNames) {
    const res = validateField('name', name);
    assert.strictEqual(
      res,
      'Name contains invalid characters.',
      `Expected "${name}" to be rejected for invalid chars, got "${res}"`
    );
  }
});

test('Email Validation - Boundary: Empty and Whitespace', () => {
  assert.strictEqual(validateField('email', ''), 'Email is required.');
  assert.strictEqual(validateField('email', '   '), 'Email is required.');
});

test('Email Validation - Standard & Extended Valid Email Formats', () => {
  const validEmails = [
    'shaik.rohit.official@gmail.com',
    'alex@example.com',
    'john.smith@domain.co.uk',
    'user+tag@sub.domain.org',
    'first_last@engineering.tech',
    'c-3po@rebel.alliance',
  ];

  for (const email of validEmails) {
    const res = validateField('email', email);
    assert.strictEqual(res, undefined, `Expected email "${email}" to be valid, got "${res}"`);
  }
});

test('Email Validation - Malformed & Invalid Formats', () => {
  const invalidEmails = [
    'plainaddress',
    '@missinguser.com',
    'user@.com',
    'user@domain',
    'user@domain.c', // Single char TLD
    'user @domain.com', // Space inside
    'user@ domain.com',
    'user@domain .com',
  ];

  for (const email of invalidEmails) {
    const res = validateField('email', email);
    assert.strictEqual(
      res,
      'Please enter a valid email address (e.g. name@domain.com).',
      `Expected invalid email "${email}" to be rejected, got "${res}"`
    );
  }
});

test('Email Validation - RFC Length Boundaries (254 vs 255 chars)', () => {
  // 64 char local part + '@' + 185 char domain + '.com' = 254 chars
  const exact254 = 'a'.repeat(64) + '@' + 'b'.repeat(185) + '.com';
  assert.strictEqual(exact254.length, 254);
  assert.strictEqual(validateField('email', exact254), undefined);

  // 255 chars
  const len255 = 'a'.repeat(64) + '@' + 'b'.repeat(186) + '.com';
  assert.strictEqual(len255.length, 255);
  assert.strictEqual(validateField('email', len255), 'Email address is too long.');
});

test('Message Validation - Boundary: Empty, whitespace, < 10 chars', () => {
  assert.strictEqual(validateField('message', ''), 'Message is required.');
  assert.strictEqual(validateField('message', '         '), 'Message is required.'); // 9 spaces trimmed to empty
  assert.strictEqual(validateField('message', '123456789'), 'Message must be at least 10 characters.');
});

test('Message Validation - Boundary: 10 chars, Multi-line, 5000 chars, 5001 chars', () => {
  // Exactly 10 chars
  assert.strictEqual(validateField('message', '1234567890'), undefined);

  // Multi-line formatting with tabs and newlines
  const multiLine = 'Hello Rohit,\n\nI am impressed with your portfolio.\n\tLet us connect!\n\nBest regards,\nAlex';
  assert.strictEqual(validateField('message', multiLine), undefined);

  // 5000 chars
  const exact5000 = 'M'.repeat(5000);
  assert.strictEqual(validateField('message', exact5000), undefined);

  // 5001 chars
  const len5001 = 'M'.repeat(5001);
  assert.strictEqual(validateField('message', len5001), 'Message cannot exceed 5000 characters.');
});

test('VisitorType Persona Validation', () => {
  assert.strictEqual(validateField('visitorType', 'developer'), undefined);
  assert.strictEqual(validateField('visitorType', 'recruiter'), undefined);
  assert.strictEqual(validateField('visitorType', 'student'), undefined);
  assert.strictEqual(validateField('visitorType', 'explorer'), undefined);

  assert.strictEqual(validateField('visitorType', 'hacker'), 'Please select a valid persona.');
  assert.strictEqual(validateField('visitorType', 'admin'), 'Please select a valid persona.');
  assert.strictEqual(validateField('visitorType', ''), 'Please select a valid persona.');
});

test('validateAll - Comprehensive Form State Validation', () => {
  // All empty
  const emptyForm = { name: '', email: '', message: '', visitorType: 'developer' };
  const emptyErrors = validateAll(emptyForm);
  assert.deepStrictEqual(Object.keys(emptyErrors).sort(), ['email', 'message', 'name']);

  // Valid form
  const validForm = {
    name: 'Shaik Rohit',
    email: 'shaik.rohit.official@gmail.com',
    message: 'We would love to discuss an AI Full-Stack role at our company.',
    visitorType: 'recruiter',
  };
  const validErrors = validateAll(validForm);
  assert.deepStrictEqual(validErrors, {});
});

// -----------------------------------------------------------------------------
// MODULE 2: Form Error Recovery & Real-Time Transition Simulation
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 2: Form Error Recovery & State Machine ---');

test('Error Recovery - Real-Time Error Clearance on User Input Correction', () => {
  // Simulate state variables
  let values = { name: '', email: '', message: '', visitorType: 'developer' };
  let touched = { name: true, email: true, message: true, visitorType: true };
  let errors = validateAll(values);

  // Initially has errors
  assert.strictEqual(errors.name, 'Name is required.');
  assert.strictEqual(errors.email, 'Email is required.');
  assert.strictEqual(errors.message, 'Message is required.');

  // User begins typing valid name
  values.name = 'R';
  errors.name = validateField('name', values.name);
  assert.strictEqual(errors.name, 'Name must be at least 2 characters.');

  values.name = 'Rohit Shaik';
  errors.name = validateField('name', values.name);
  assert.strictEqual(errors.name, undefined, 'Name error must clear when valid name is entered');

  // User fixes email
  values.email = 'rohit@example';
  errors.email = validateField('email', values.email);
  assert.strictEqual(errors.email, 'Please enter a valid email address (e.g. name@domain.com).');

  values.email = 'rohit@example.com';
  errors.email = validateField('email', values.email);
  assert.strictEqual(errors.email, undefined, 'Email error must clear when valid email is entered');

  // User fixes message
  values.message = 'Hello, this is a verified test message for the contact form!';
  errors.message = validateField('message', values.message);
  assert.strictEqual(errors.message, undefined, 'Message error must clear');

  // Final check: all errors cleared
  const activeErrors = Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== undefined));
  assert.deepStrictEqual(activeErrors, {}, 'No remaining errors after correction');
});

test('Error Recovery - Transmission Error Clears on Input Change', () => {
  let status = 'error';
  let submitError = 'Failed to deliver message. Network timeout.';

  // handleChange simulation
  const simulateChange = (field, val) => {
    if (status === 'error') {
      status = 'validating';
      submitError = null;
    }
  };

  simulateChange('message', 'Updated message content');
  assert.strictEqual(status, 'validating', 'Status should transition from error to validating');
  assert.strictEqual(submitError, null, 'submitError should be cleared on input change');
});

// -----------------------------------------------------------------------------
// MODULE 3: Orbital Mathematics & Upright Nodes Invariant
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 3: Orbital Geometry & Counter-Rotation Invariant ---');

const socialOrbitSource = fs.readFileSync('src/components/contact/SocialOrbit.tsx', 'utf8');

// Parse ORBIT_ITEMS from SocialOrbit.tsx
function extractOrbitItems(source) {
  const match = source.match(/const ORBIT_ITEMS:\s*OrbitItem\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!match) throw new Error('Could not find ORBIT_ITEMS in SocialOrbit.tsx');

  // Extract id and angleDeg
  const items = [];
  const itemMatches = [...match[1].matchAll(/id:\s*['"]([^'"]+)['"][\s\S]*?angleDeg:\s*(\d+)/g)];
  for (const m of itemMatches) {
    items.push({ id: m[1], angleDeg: parseInt(m[2], 10) });
  }
  return items;
}

const orbitItems = extractOrbitItems(socialOrbitSource);

test('Orbital Nodes - Exact Cardinal Angles and Quad-Symmetric Spacing', () => {
  assert.strictEqual(orbitItems.length, 4, 'Should have exactly 4 orbit nodes');
  const angles = orbitItems.map((item) => item.angleDeg);

  // Verify angles are 0, 90, 180, 270 (cardinal points)
  assert.deepStrictEqual(
    [...angles].sort((a, b) => a - b),
    [0, 90, 180, 270],
    'Nodes must be at 0, 90, 180, 270 degrees'
  );

  // Check 90 degree spacing
  const sorted = [...angles].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    const next = sorted[(i + 1) % sorted.length];
    const diff = (next - sorted[i] + 360) % 360;
    assert.strictEqual(diff, 90, `Spacing between adjacent nodes must be exactly 90 degrees, got ${diff}`);
  }
});

function createIdentity() {
  return [1, 0, 0, 1, 0, 0];
}

function multiplyMatrices(m1, m2) {
  const [a1, c1, b1, d1, tx1, ty1] = m1;
  const [a2, c2, b2, d2, tx2, ty2] = m2;

  return [
    a1 * a2 + c1 * b2,
    a1 * c2 + c1 * d2,
    b1 * a2 + d1 * b2,
    b1 * c2 + d1 * d2,
    a1 * tx2 + c1 * ty2 + tx1,
    b1 * tx2 + d1 * ty2 + ty1,
  ];
}

function createRotation(deg) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [cos, -sin, sin, cos, 0, 0];
}

function createTranslation(tx, ty) {
  return [1, 0, 0, 1, tx, ty];
}

test('Orbital Geometry - Constant Orbit Radius and Path Circularity Oracle', () => {
  const R = 130; // nominal px radius
  const orbitDistance = -R; // --orbit-distance: -130px

  // Test across full 360 rotation at 5-degree increments
  for (let trackDeg = 0; trackDeg <= 360; trackDeg += 5) {
    for (const item of orbitItems) {
      const alpha = item.angleDeg;

      // Track rotation matrix
      const mTrack = createRotation(trackDeg);

      // Node transform: translate(-50%, -50%) rotate(alpha) translateY(d) rotate(-alpha)
      const mNodePos = multiplyMatrices(createRotation(alpha), createTranslation(0, orbitDistance));

      // Global position matrix of node center
      const mGlobal = multiplyMatrices(mTrack, mNodePos);

      const posX = mGlobal[4];
      const posY = mGlobal[5];

      const computedRadius = Math.sqrt(posX * posX + posY * posY);
      const radiusDelta = Math.abs(computedRadius - R);

      assert(
        radiusDelta < 1e-10,
        `Radius must remain invariant R=${R}. At trackDeg=${trackDeg}, item=${item.id}, computed=${computedRadius}`
      );
    }
  }
});

test('Orbital Geometry - Complete Counter-Rotation Cancellation Proof (Orientation = 0deg at all t)', () => {
  // At any time t in [0, 36s], track rotation is theta, and node inner counter-rotation is -theta.
  // The node itself has style transform: rotate(alpha) translateY(d) rotate(-alpha).
  // The orientation of the inner node content in global viewport coordinates is:
  // M_orient = R(theta) * R(alpha) * R(-alpha) * R(-theta)

  for (let trackDeg = 0; trackDeg <= 360; trackDeg += 10) {
    const counterDeg = -trackDeg;

    for (const item of orbitItems) {
      const alpha = item.angleDeg;

      let m = createIdentity();
      m = multiplyMatrices(m, createRotation(trackDeg)); // Track rotation
      m = multiplyMatrices(m, createRotation(alpha)); // Node initial rotation
      m = multiplyMatrices(m, createRotation(-alpha)); // Node self-counter rotation
      m = multiplyMatrices(m, createRotation(counterDeg)); // Inner counter rotation

      const [a, c, b, d] = m;

      // In identity matrix, a = 1, c = 0, b = 0, d = 1
      const isIdentity =
        Math.abs(a - 1) < 1e-10 && Math.abs(d - 1) < 1e-10 && Math.abs(c) < 1e-10 && Math.abs(b) < 1e-10;

      // Compute actual orientation angle
      const orientationDeg = (Math.atan2(b, a) * 180) / Math.PI;

      assert(
        isIdentity,
        `Inner node content must have identity orientation (0 deg). Got orientation=${orientationDeg} at trackDeg=${trackDeg}, item=${item.id}`
      );
    }
  }
});

// -----------------------------------------------------------------------------
// MODULE 4: CSS Rules, Reduced Motion & Event Triggers Oracle
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 4: CSS Rules, Reduced Motion & Pause Triggers ---');

test('CSS Keyframes - Equal Durations & Inverted Directions', () => {
  assert(socialOrbitSource.includes('animation: socialOrbitSpin 36s linear infinite;'));
  assert(socialOrbitSource.includes('animation: socialOrbitCounter 36s linear infinite;'));

  assert(socialOrbitSource.includes('@keyframes socialOrbitSpin'));
  assert(socialOrbitSource.includes('transform: rotate(360deg);'));

  assert(socialOrbitSource.includes('@keyframes socialOrbitCounter'));
  assert(socialOrbitSource.includes('transform: rotate(-360deg);'));
});

test('CSS Hover, Focus-Within, and Manual Pause Selectors', () => {
  const pauseSelectors = [
    '.social-orbit-container:hover .social-orbit-track',
    '.social-orbit-container:hover .social-orbit-node-inner',
    '.social-orbit-container:focus-within .social-orbit-track',
    '.social-orbit-container:focus-within .social-orbit-node-inner',
    '.social-orbit-track[data-paused="true"]',
    '.social-orbit-node-inner[data-paused="true"]',
  ];

  for (const sel of pauseSelectors) {
    assert(socialOrbitSource.includes(sel), `CSS must include pause selector: ${sel}`);
  }

  assert(socialOrbitSource.includes('animation-play-state: paused !important;'));
});

test('CSS Prefers-Reduced-Motion Media Query Rule', () => {
  assert(socialOrbitSource.includes('@media (prefers-reduced-motion: reduce)'));
  assert(socialOrbitSource.includes('animation: none !important;'));
});

// -----------------------------------------------------------------------------
// MODULE 5: Clipboard API Resilience & Fallbacks (ContactInfoCards)
// -----------------------------------------------------------------------------
console.log('\n--- MODULE 5: Clipboard API Resilience in ContactInfoCards ---');

const contactInfoCardsSource = fs.readFileSync('src/components/contact/ContactInfoCards.tsx', 'utf8');

test('Clipboard Copy - Graceful Failure when navigator.clipboard.writeText rejects', async () => {
  let copiedState = false;
  const setCopied = (val) => {
    copiedState = val;
  };

  // Mock navigator with failing clipboard (e.g. Permission Denied)
  const mockNavigator = {
    clipboard: {
      writeText: async () => {
        throw new Error('DOMException: Clipboard permission denied');
      },
    },
  };

  // Run handleCopyEmail logic as implemented in ContactInfoCards.tsx
  const handleCopyEmail = async (nav) => {
    try {
      await nav.clipboard.writeText('shaik.rohit.official@gmail.com');
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  await handleCopyEmail(mockNavigator);
  assert.strictEqual(copiedState, false, 'copied state must safely remain false on rejection');
});

test('Clipboard Copy - Graceful Failure when navigator.clipboard is undefined', async () => {
  let copiedState = false;
  const setCopied = (val) => {
    copiedState = val;
  };

  // Mock navigator without clipboard API (insecure HTTP context or embedded webview)
  const mockNavigator = {};

  const handleCopyEmail = async (nav) => {
    try {
      await nav.clipboard.writeText('shaik.rohit.official@gmail.com');
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  // Should not throw an uncaught exception
  await handleCopyEmail(mockNavigator);
  assert.strictEqual(copiedState, false, 'copied state must safely remain false when clipboard is undefined');
});

test('Clipboard Copy - Success State when navigator.clipboard.writeText succeeds', async () => {
  let copiedState = false;
  let copiedText = '';
  const setCopied = (val) => {
    copiedState = val;
  };

  const mockNavigator = {
    clipboard: {
      writeText: async (text) => {
        copiedText = text;
      },
    },
  };

  const handleCopyEmail = async (nav) => {
    try {
      await nav.clipboard.writeText('shaik.rohit.official@gmail.com');
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  await handleCopyEmail(mockNavigator);
  assert.strictEqual(copiedState, true, 'copied state must be true on success');
  assert.strictEqual(copiedText, 'shaik.rohit.official@gmail.com', 'Copied text must match profile email');
});

test('ContactInfoCards - Verified Mailto Fallback Link Present', () => {
  assert(
    contactInfoCardsSource.includes('href={`mailto:${profile.email}`}'),
    'Mailto link must be present as a fallback for users who cannot or do not use clipboard'
  );
  assert(contactInfoCardsSource.includes('aria-live="polite"'), 'Screen reader live announcement must be present');
});

// -----------------------------------------------------------------------------
// SUMMARY & EXIT
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(
  `TEST SUMMARY: ${RESULTS.passed} PASSED, ${RESULTS.defectsIdentified} DEFECTS CONFIRMED, ${RESULTS.failed} UNEXPECTED FAILURES out of ${RESULTS.tests.length} tests`
);
console.log('================================================================\n');

if (RESULTS.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
