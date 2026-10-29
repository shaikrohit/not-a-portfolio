/**
 * Challenger 1 Deep Empirical Stress Harness
 * Target: /api/contact route running on http://localhost:3001
 * 
 * Tests:
 * 1. RFC 5321 Email Length Boundary & Conformance (>254 chars, exactly 254 chars, trimmed 254 vs 255)
 * 2. CRLF Injection Neutralization in Name, Email, and Message
 * 3. Invariant: 0 HTTP 500 errors across all client validation failures (strictly 400 or 405)
 * 4. High Concurrency Burst & ReDoS Stress Testing
 */

import assert from 'node:assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api/contact`;

console.log('================================================================');
console.log('CHALLENGER 1: CONTACT API DEEP EMPIRICAL STRESS TEST SUITE');
console.log(`Target: ${API_URL}`);
console.log(`Timestamp: ${new Date().toISOString()}`);
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

async function sendRequest(payload, options = {}) {
  const method = options.method || 'POST';
  const headers = options.headers || { 'Content-Type': 'application/json' };
  let body = undefined;

  if (method !== 'GET') {
    if (options.rawBody !== undefined) {
      body = options.rawBody;
    } else {
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
  return { status, rawText, json };
}

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
  if (rawOutput) console.error(`       Output: ${rawOutput.slice(0, 200)}`);
  failureDetails.push({ testName, reason, rawOutput });
}

// ============================================================================
// SUITE 1: RFC 5321 Email Length Boundary Tests
// ============================================================================
console.log('--- SUITE 1: RFC 5321 Email Length Limits (Max 254 Characters) ---');

// Helper to build valid email of exact length:
// local@domain.com
// domain = sub.domain.com
function buildEmailOfLength(targetLength) {
  const fixedSuffix = '@test.example.com'; // length 17
  const neededLocal = targetLength - fixedSuffix.length;
  if (neededLocal <= 0) throw new Error('Target length too small');
  return 'a'.repeat(neededLocal) + fixedSuffix;
}

// 1.1: Exactly 254 characters (Valid RFC 5321 maximum)
{
  const email254 = buildEmailOfLength(254);
  assert.strictEqual(email254.length, 254, 'Constructed email must be 254 chars');
  const res = await sendRequest({
    name: 'RFC Boundary Tester',
    email: email254,
    message: 'Testing email at exactly 254 characters boundary limit.',
  });

  if (res.status === 200 && res.json?.success === true) {
    recordPass('RFC5321-1.1: Exactly 254 characters email is accepted (HTTP 200)');
  } else {
    recordFail('RFC5321-1.1: Exactly 254 characters email', `Expected 200, got ${res.status}`, res.rawText);
  }
}

// 1.2: Exactly 255 characters (Exceeds RFC 5321 by 1 char -> Must return 400)
{
  const email255 = buildEmailOfLength(255);
  assert.strictEqual(email255.length, 255, 'Constructed email must be 255 chars');
  const res = await sendRequest({
    name: 'RFC Boundary Tester',
    email: email255,
    message: 'Testing email at 255 characters boundary limit.',
  });

  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('254 characters')) {
    recordPass('RFC5321-1.2: 255 characters email is rejected with 400 and RFC length message');
  } else {
    recordFail('RFC5321-1.2: 255 characters email', `Expected 400 with 254 chars msg, got ${res.status}`, res.rawText);
  }
}

// 1.3: 500 characters email (Massively exceeds limit -> Must return 400, NEVER 500)
{
  const email500 = buildEmailOfLength(500);
  assert.strictEqual(email500.length, 500);
  const res = await sendRequest({
    name: 'RFC Boundary Tester',
    email: email500,
    message: 'Testing email at 500 characters length.',
  });

  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('254 characters')) {
    recordPass('RFC5321-1.3: 500 characters email rejected with 400');
  } else {
    recordFail('RFC5321-1.3: 500 characters email', `Expected 400, got ${res.status}`, res.rawText);
  }
}

// 1.4: 10,000 characters email (Stress length -> Must return 400, NEVER 500 or crash)
{
  const email10k = buildEmailOfLength(10000);
  assert.strictEqual(email10k.length, 10000);
  const res = await sendRequest({
    name: 'RFC Boundary Tester',
    email: email10k,
    message: 'Testing email at 10,000 characters length.',
  });

  if (res.status === 400 && res.json?.success === false) {
    recordPass('RFC5321-1.4: 10,000 characters email rejected with 400 without crashing');
  } else {
    recordFail('RFC5321-1.4: 10,000 characters email', `Expected 400, got ${res.status}`, res.rawText);
  }
}

// 1.5: Whitespace-padded email whose trimmed length is 254 chars (Valid -> HTTP 200)
{
  const email254 = buildEmailOfLength(254);
  const paddedEmail = `   ${email254}   `;
  const res = await sendRequest({
    name: 'RFC Boundary Tester',
    email: paddedEmail,
    message: 'Testing whitespace-padded 254 chars email.',
  });

  if (res.status === 200 && res.json?.success === true) {
    recordPass('RFC5321-1.5: Whitespace-padded 254-character email accepted after trimming (HTTP 200)');
  } else {
    recordFail('RFC5321-1.5: Padded 254 email', `Expected 200, got ${res.status}`, res.rawText);
  }
}

// 1.6: Whitespace-padded email whose trimmed length is 255 chars (Invalid -> HTTP 400)
{
  const email255 = buildEmailOfLength(255);
  const paddedEmail = `   ${email255}   `;
  const res = await sendRequest({
    name: 'RFC Boundary Tester',
    email: paddedEmail,
    message: 'Testing whitespace-padded 255 chars email.',
  });

  if (res.status === 400 && res.json?.success === false) {
    recordPass('RFC5321-1.6: Whitespace-padded 255-character email rejected (HTTP 400)');
  } else {
    recordFail('RFC5321-1.6: Padded 255 email', `Expected 400, got ${res.status}`, res.rawText);
  }
}

// ============================================================================
// SUITE 2: CRLF Injection Neutralization Tests
// ============================================================================
console.log('\n--- SUITE 2: CRLF Injection Stress & Neutralization ---');

// 2.1: CRLF in Name (Email header injection attempt via \r\nBcc:)
{
  const res = await sendRequest({
    name: 'Alice Smith\r\nBcc: evil-attacker@victim.com',
    email: 'alice@example.com',
    message: 'Testing CRLF header injection neutralization in name.',
  });

  // Name should be accepted (or sanitized to single spaces) and handled without 500 error
  if (res.status === 200 && res.json?.success === true) {
    recordPass('CRLF-2.1: CRLF in name is neutralized and processed cleanly (HTTP 200)');
  } else {
    recordFail('CRLF-2.1: CRLF in name', `Expected 200, got ${res.status}`, res.rawText);
  }
}

// 2.2: Multiple consecutive CRLF and LF combinations in Name
{
  const res = await sendRequest({
    name: 'Bob\r\n\r\nSubject: Overwrite\r\n\n\rJones',
    email: 'bob@example.com',
    message: 'Testing multiple consecutive CRLFs in name.',
  });

  if (res.status === 200 && res.json?.success === true) {
    recordPass('CRLF-2.2: Multiple consecutive CRLFs in name neutralized (HTTP 200)');
  } else {
    recordFail('CRLF-2.2: Multiple CRLFs in name', `Expected 200, got ${res.status}`, res.rawText);
  }
}

// 2.3: Name containing only CRLF and whitespace (Becomes empty -> Must return 400)
{
  const res = await sendRequest({
    name: '\r\n\r\n   \r\n',
    email: 'alice@example.com',
    message: 'Testing CRLF-only name rejection.',
  });

  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('Name must be at least')) {
    recordPass('CRLF-2.3: CRLF-only name rejected with 400 (not 500)');
  } else {
    recordFail('CRLF-2.3: CRLF-only name', `Expected 400, got ${res.status}`, res.rawText);
  }
}

// 2.4: Name containing 1 char + CRLF (Trims to 1 char -> Must return 400)
{
  const res = await sendRequest({
    name: 'A\r\n',
    email: 'alice@example.com',
    message: 'Testing 1-char + CRLF name rejection.',
  });

  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('Name must be at least 2 characters')) {
    recordPass('CRLF-2.4: 1-char + CRLF name rejected with 400 (not 500)');
  } else {
    recordFail('CRLF-2.4: 1-char + CRLF name', `Expected 400, got ${res.status}`, res.rawText);
  }
}

// 2.5: CRLF injection in Email field (Header splitting attempt)
{
  const res = await sendRequest({
    name: 'Valid Name',
    email: 'alice@example.com\r\nBcc: evil@attacker.com',
    message: 'Testing CRLF injection in email address.',
  });

  // Since EMAIL_REGEX checks ^[^\s@]+@[^\s@]+\.[^\s@]+$, whitespace / CRLF in email must be rejected with 400
  if (res.status === 400 && res.json?.success === false && res.json?.error?.includes('valid email')) {
    recordPass('CRLF-2.5: CRLF in email rejected as invalid format (HTTP 400)');
  } else {
    recordFail('CRLF-2.5: CRLF in email', `Expected 400, got ${res.status}`, res.rawText);
  }
}

// 2.6: Normal multiline message containing CRLF and LF (\r\n and \n)
{
  const res = await sendRequest({
    name: 'Valid Name',
    email: 'alice@example.com',
    message: 'Line 1\r\nLine 2\r\nLine 3 with CRLF.\nLine 4 with LF.',
  });

  if (res.status === 200 && res.json?.success === true) {
    recordPass('CRLF-2.6: Legitimate multiline CRLF in message is accepted (HTTP 200)');
  } else {
    recordFail('CRLF-2.6: Multiline message', `Expected 200, got ${res.status}`, res.rawText);
  }
}

// ============================================================================
// SUITE 3: Invariant: ZERO 500 Errors across All Client Validation Failures
// ============================================================================
console.log('\n--- SUITE 3: Zero 500 Errors Invariant on Client Validation Failures ---');

const validationFailureCases = [
  // Missing fields
  { name: 'Missing body (empty)', rawBody: '', expectedStatus: 400 },
  { name: 'Malformed JSON syntax', rawBody: '{ broken json: }', expectedStatus: 400 },
  { name: 'JSON primitive number', rawBody: '42', expectedStatus: 400 },
  { name: 'JSON array', rawBody: '["name", "email"]', expectedStatus: 400 },
  { name: 'Missing name', payload: { email: 'a@b.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Missing email', payload: { name: 'Alice', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Missing message', payload: { name: 'Alice', email: 'a@b.com' }, expectedStatus: 400 },
  // Name type / bounds
  { name: 'Name is number', payload: { name: 12345, email: 'a@b.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Name is boolean', payload: { name: true, email: 'a@b.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Name is array', payload: { name: ['Alice'], email: 'a@b.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Name is empty string', payload: { name: '', email: 'a@b.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Name is 1 character', payload: { name: 'X', email: 'a@b.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Name is 101 characters', payload: { name: 'A'.repeat(101), email: 'a@b.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  // Email type / bounds
  { name: 'Email is number', payload: { name: 'Alice', email: 9999, message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Email is object', payload: { name: 'Alice', email: { email: 'a@b.com' }, message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Email invalid format', payload: { name: 'Alice', email: 'notanemail', message: 'Hello 1234567890' }, expectedStatus: 400 },
  { name: 'Email exceeds 254 chars', payload: { name: 'Alice', email: 'a'.repeat(245) + '@example.com', message: 'Hello 1234567890' }, expectedStatus: 400 },
  // Message type / bounds
  { name: 'Message is number', payload: { name: 'Alice', email: 'a@b.com', message: 1234567890 }, expectedStatus: 400 },
  { name: 'Message is 9 chars', payload: { name: 'Alice', email: 'a@b.com', message: '123456789' }, expectedStatus: 400 },
  { name: 'Message is 5001 chars', payload: { name: 'Alice', email: 'a@b.com', message: 'M'.repeat(5001) }, expectedStatus: 400 },
  // Method guards
  { name: 'Method GET (wrong method)', method: 'GET', expectedStatus: 405 },
];

for (let i = 0; i < validationFailureCases.length; i++) {
  const tc = validationFailureCases[i];
  const res = await sendRequest(tc.payload, {
    method: tc.method || 'POST',
    rawBody: tc.rawBody,
  });

  // The critical invariant: status MUST NOT be 500
  if (res.status === 500) {
    recordFail(`INV-3.${i + 1}: ${tc.name}`, `CRITICAL REGRESSION: Returned HTTP 500 Internal Server Error`, res.rawText);
  } else if (res.status === tc.expectedStatus) {
    recordPass(`INV-3.${i + 1}: ${tc.name} properly returned HTTP ${res.status} (Zero 500)`);
  } else {
    recordFail(`INV-3.${i + 1}: ${tc.name}`, `Expected HTTP ${tc.expectedStatus}, got ${res.status}`, res.rawText);
  }
}

// ============================================================================
// SUITE 4: High Concurrency Burst & ReDoS Stress Testing
// ============================================================================
console.log('\n--- SUITE 4: Concurrency Burst & ReDoS Stress ---');

// 4.1: ReDoS regex vulnerability test against EMAIL_REGEX
{
  const reDosPayload = 'a'.repeat(200) + '@' + 'b'.repeat(50);
  const start = performance.now();
  const res = await sendRequest({
    name: 'ReDoS Tester',
    email: reDosPayload, // Missing dot, triggers regex match failure
    message: 'Testing regex execution time for catastrophic backtracking.',
  });
  const elapsed = performance.now() - start;

  if (res.status === 400 && elapsed < 500) {
    recordPass(`STRESS-4.1: ReDoS regex rejection executed in ${elapsed.toFixed(1)}ms (< 500ms threshold)`);
  } else {
    recordFail('STRESS-4.1: ReDoS regex', `Execution took ${elapsed.toFixed(1)}ms or status != 400 (${res.status})`, res.rawText);
  }
}

// 4.2: Parallel burst of 30 requests sent simultaneously
{
  const burstCount = 30;
  const burstPromises = [];
  for (let i = 0; i < burstCount; i++) {
    const isValid = i % 2 === 0;
    const p = isValid
      ? sendRequest({
          name: `Concurrent User ${i}`,
          email: `user${i}@example.com`,
          message: `Concurrent message payload number ${i} for load testing.`,
          visitorType: 'developer',
        })
      : sendRequest({
          name: `Concurrent Invalid ${i}`,
          email: `invalid-email-${i}`,
          message: `Should fail with 400`,
        });
    burstPromises.push(p.then(r => ({ i, isValid, status: r.status, json: r.json })));
  }

  const results = await Promise.all(burstPromises);
  const any500 = results.some(r => r.status === 500);
  const allCorrect = results.every(r => (r.isValid ? r.status === 200 : r.status === 400));

  if (!any500 && allCorrect) {
    recordPass(`STRESS-4.2: Concurrency burst of ${burstCount} parallel requests handled cleanly with 0 server errors`);
  } else {
    recordFail('STRESS-4.2: Concurrency burst', `Found errors: any500=${any500}, allCorrect=${allCorrect}`);
  }
}

// 4.3: Unicode surrogates, null bytes, and non-printable control characters
{
  const res = await sendRequest({
    name: 'Unicode \uD83D\uDE00 \u0000 \x1b[31mRed\x1b[0m',
    email: 'unicode@example.com',
    message: 'Testing null byte \u0000 and escape codes resilience.',
  });

  if (res.status === 200 && res.json?.success === true) {
    recordPass('STRESS-4.3: Control chars, null byte, and ANSI escapes handled cleanly without crash (HTTP 200)');
  } else {
    recordFail('STRESS-4.3: Control characters', `Expected 200, got ${res.status}`, res.rawText);
  }
}

console.log('\n================================================================');
console.log(`STRESS RESULTS: ${passedTests} PASSED, ${failedTests} FAILED (Total: ${totalTests})`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
