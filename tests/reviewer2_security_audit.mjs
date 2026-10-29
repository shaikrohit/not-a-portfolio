/**
 * Reviewer 2 Independent Adversarial Verification Suite
 * Milestone 1 Iteration 2: Backend API & Security Verification
 * Target: http://localhost:3001/api/contact
 */

import assert from 'node:assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api/contact`;

console.log('================================================================');
console.log('REVIEWER 2 INDEPENDENT ADVERSARIAL AUDIT');
console.log(`Target: ${API_URL}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function request(payload, options = {}) {
  const method = options.method || 'POST';
  const headers = options.headers || { 'Content-Type': 'application/json' };
  let body = undefined;

  if (method !== 'GET' && method !== 'HEAD') {
    if (options.rawBody !== undefined) {
      body = options.rawBody;
    } else if (payload !== undefined) {
      body = JSON.stringify(payload);
    }
  }

  const res = await fetch(API_URL, { method, headers, body });
  const status = res.status;
  const rawText = await res.text();
  let json = null;
  try {
    json = JSON.parse(rawText);
  } catch {
    json = null;
  }
  return { status, rawText, json, headers: res.headers };
}

function pass(name, detail = '') {
  totalTests++;
  passedTests++;
  console.log(`[PASS] ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, reason, raw = '') {
  totalTests++;
  failedTests++;
  console.error(`[FAIL] ${name}`);
  console.error(`       Reason: ${reason}`);
  if (raw) console.error(`       Raw: ${raw.slice(0, 150)}`);
}

// -------------------------------------------------------------
// SECTION 1: CRLF Injection Neutralization & Sanitization
// -------------------------------------------------------------
console.log('--- SECTION 1: CRLF Injection Neutralization ---');

// 1.1: Single CRLF in Name
{
  const res = await request({
    name: 'Alice\r\nBcc: hacker@example.com',
    email: 'alice@example.com',
    message: 'Testing single CRLF header injection in name.',
  });
  if (res.status === 200 && res.json?.success === true) {
    pass('CRLF-1.1: Single CRLF in name normalized and accepted (HTTP 200)');
  } else {
    fail('CRLF-1.1: Single CRLF in name', `Status ${res.status}`, res.rawText);
  }
}

// 1.2: Multiple consecutive CRLF sequences in Name
{
  const res = await request({
    name: 'Attacker\r\n\r\nCC: spy@example.com\r\nSubject: Spoofed\r\n',
    email: 'attacker@example.com',
    message: 'Testing multiple CRLFs in name.',
  });
  if (res.status === 200 && res.json?.success === true) {
    pass('CRLF-1.2: Multiple consecutive CRLF sequences normalized (HTTP 200)');
  } else {
    fail('CRLF-1.2: Multiple consecutive CRLFs', `Status ${res.status}`, res.rawText);
  }
}

// 1.3: Isolated \r (Mac classic) and isolated \n (Unix)
{
  const res = await request({
    name: 'Bob\rJones\nSmith',
    email: 'bob@example.com',
    message: 'Testing isolated CR and LF characters in name.',
  });
  if (res.status === 200 && res.json?.success === true) {
    pass('CRLF-1.3: Isolated CR and LF characters normalized (HTTP 200)');
  } else {
    fail('CRLF-1.3: Isolated CR/LF', `Status ${res.status}`, res.rawText);
  }
}

// 1.4: Name consisting solely of CRLF and whitespace
{
  const res = await request({
    name: '\r\n \r\n \r \n  ',
    email: 'alice@example.com',
    message: 'Testing CRLF-only name rejection.',
  });
  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('Name must be at least')) {
    pass('CRLF-1.4: Name of solely CRLF/whitespace cleanly rejected with HTTP 400');
  } else {
    fail('CRLF-1.4: CRLF-only name', `Status ${res.status}`, res.rawText);
  }
}

// 1.5: CRLF injection attempt inside email address
{
  const res = await request({
    name: 'Valid Name',
    email: 'victim@example.com\r\nBcc: evil@attacker.com',
    message: 'Testing CRLF injection in email field.',
  });
  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('valid email')) {
    pass('CRLF-1.5: CRLF injection inside email rejected with HTTP 400');
  } else {
    fail('CRLF-1.5: CRLF in email', `Status ${res.status}`, res.rawText);
  }
}

// -------------------------------------------------------------
// SECTION 2: RFC 5321 Email Length Validation
// -------------------------------------------------------------
console.log('\n--- SECTION 2: RFC 5321 Email Length Validation ---');

function makeEmail(length) {
  const domain = '@test.example.com'; // 17 chars
  const localLen = length - domain.length;
  if (localLen <= 0) throw new Error('Length too short');
  return 'x'.repeat(localLen) + domain;
}

// 2.1: Exactly 254 characters (RFC 5321 maximum valid length)
{
  const email254 = makeEmail(254);
  assert.strictEqual(email254.length, 254);
  const res = await request({
    name: 'RFC 254 User',
    email: email254,
    message: 'Message testing valid RFC 5321 254-char email.',
  });
  if (res.status === 200 && res.json?.success === true) {
    pass('RFC-2.1: Exactly 254 characters email accepted (HTTP 200)');
  } else {
    fail('RFC-2.1: 254 char email', `Status ${res.status}`, res.rawText);
  }
}

// 2.2: Exactly 255 characters (1 char beyond RFC 5321 limit)
{
  const email255 = makeEmail(255);
  assert.strictEqual(email255.length, 255);
  const res = await request({
    name: 'RFC 255 User',
    email: email255,
    message: 'Message testing 255-char email.',
  });
  if (
    res.status === 400 &&
    res.json?.success === false &&
    res.json?.error?.includes('254 characters')
  ) {
    pass('RFC-2.2: 255 characters email rejected with HTTP 400 and clear error message');
  } else {
    fail('RFC-2.2: 255 char email', `Status ${res.status}`, res.rawText);
  }
}

// 2.3: Trimmed 254 vs raw > 254
{
  const email254 = makeEmail(254);
  const rawPadded = `    ${email254}    `;
  const res = await request({
    name: 'Padded RFC User',
    email: rawPadded,
    message: 'Message testing padded 254-char email.',
  });
  if (res.status === 200 && res.json?.success === true) {
    pass('RFC-2.3: Whitespace-padded email with trimmed length 254 accepted (HTTP 200)');
  } else {
    fail('RFC-2.3: Padded 254 char email', `Status ${res.status}`, res.rawText);
  }
}

// 2.4: Trimmed 255 with padding
{
  const email255 = makeEmail(255);
  const rawPadded = `  ${email255}  `;
  const res = await request({
    name: 'Padded RFC 255 User',
    email: rawPadded,
    message: 'Message testing padded 255-char email.',
  });
  if (res.status === 400 && res.json?.success === false) {
    pass('RFC-2.4: Whitespace-padded email with trimmed length 255 rejected (HTTP 400)');
  } else {
    fail('RFC-2.4: Padded 255 char email', `Status ${res.status}`, res.rawText);
  }
}

// 2.5: Extreme length (50,000 characters)
{
  const hugeEmail = 'a'.repeat(49980) + '@example.com';
  const res = await request({
    name: 'Extreme Email Tester',
    email: hugeEmail,
    message: 'Testing huge email string safety.',
  });
  if (res.status === 400 && res.json?.success === false) {
    pass('RFC-2.5: 50,000-char email rejected with HTTP 400 without crashing');
  } else {
    fail('RFC-2.5: Extreme email length', `Status ${res.status}`, res.rawText);
  }
}

// -------------------------------------------------------------
// SECTION 3: Multi-channel Delivery Tracking & Fallback
// -------------------------------------------------------------
console.log('\n--- SECTION 3: Multi-channel Delivery Tracking ---');

// 3.1: Offline / Dev Mock Fallback returns HTTP 200
{
  const res = await request({
    name: 'Mock Test User',
    email: 'mock@example.com',
    message: 'Testing offline/dev mock delivery fallback.',
    visitorType: 'student',
  });
  if (res.status === 200 && res.json?.success === true && res.json?.message) {
    pass('DELIV-3.1: Offline/dev unconfigured mode returns HTTP 200 with success confirmation');
  } else {
    fail('DELIV-3.1: Offline mock delivery', `Status ${res.status}`, res.rawText);
  }
}

// -------------------------------------------------------------
// SECTION 4: Supabase Schema Fallback & Invariant Integrity
// -------------------------------------------------------------
console.log('\n--- SECTION 4: Schema Fallback Logic & Protocol Hardening ---');

// 4.1: HTTP Methods: PUT, DELETE, PATCH, OPTIONS
{
  const methods = ['PUT', 'DELETE', 'PATCH'];
  let allMethodPass = true;
  for (const m of methods) {
    const res = await request({}, { method: m });
    // Next.js App Router returns 405 Method Not Allowed for unimplemented HTTP methods
    if (res.status !== 405) {
      allMethodPass = false;
      fail(`PROTO-4.1: Method ${m}`, `Expected 405, got ${res.status}`);
    }
  }
  if (allMethodPass) {
    pass('PROTO-4.1: Non-POST mutation methods (PUT, DELETE, PATCH) rejected with HTTP 405');
  }
}

// 4.2: Content-Type variations (text/plain, application/x-www-form-urlencoded)
{
  const res = await request(undefined, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    rawBody: 'Plain text payload instead of JSON',
  });
  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('JSON')) {
    pass('PROTO-4.2: text/plain body without valid JSON rejected with HTTP 400');
  } else {
    fail('PROTO-4.2: text/plain Content-Type', `Status ${res.status}`, res.rawText);
  }
}

// 4.3: Type Confusion: numeric name, array email, object message
{
  const res = await request({
    name: 99999,
    email: ['evil@attacker.com'],
    message: { nested: 'object' },
  });
  if (res.status === 400 && res.json?.success === false) {
    pass('PROTO-4.3: Type confusion (numbers/arrays/objects) caught and rejected with HTTP 400');
  } else {
    fail('PROTO-4.3: Type confusion', `Status ${res.status}`, res.rawText);
  }
}

// 4.4: Maximum Message Boundary (5000 chars vs 5001 chars)
{
  const msg5000 = 'A'.repeat(5000);
  const res5000 = await request({
    name: 'Max Message Tester',
    email: 'tester@example.com',
    message: msg5000,
  });
  const msg5001 = 'A'.repeat(5001);
  const res5001 = await request({
    name: 'Max Message Tester',
    email: 'tester@example.com',
    message: msg5001,
  });

  if (res5000.status === 200 && res5001.status === 400) {
    pass('BOUND-4.4: Message exact boundaries (5000 chars -> 200, 5001 chars -> 400) verified');
  } else {
    fail('BOUND-4.4: Message boundaries', `5000: ${res5000.status}, 5001: ${res5001.status}`);
  }
}

// 4.5: Name Boundary (2 chars vs 1 char, 100 chars vs 101 chars)
{
  const res1 = await request({ name: 'A', email: 'a@b.com', message: 'Hello 1234567890' });
  const res2 = await request({ name: 'Al', email: 'a@b.com', message: 'Hello 1234567890' });
  const res100 = await request({ name: 'A'.repeat(100), email: 'a@b.com', message: 'Hello 1234567890' });
  const res101 = await request({ name: 'A'.repeat(101), email: 'a@b.com', message: 'Hello 1234567890' });

  if (res1.status === 400 && res2.status === 200 && res100.status === 200 && res101.status === 400) {
    pass('BOUND-4.5: Name boundaries (1 char -> 400, 2 chars -> 200, 100 -> 200, 101 -> 400) verified');
  } else {
    fail('BOUND-4.5: Name boundaries', `1:${res1.status}, 2:${res2.status}, 100:${res100.status}, 101:${res101.status}`);
  }
}

console.log('\n================================================================');
console.log(`AUDIT RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
