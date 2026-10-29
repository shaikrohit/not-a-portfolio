/**
 * Empirical Adversarial Test Harness for /api/contact
 * Runs against live running server on http://localhost:3001
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api/contact`;

const testCases = [
  // ==========================================
  // Category 1: Malformed JSON Payloads
  // ==========================================
  {
    id: 'JSON-1.1',
    category: 'Malformed JSON',
    description: 'Raw syntax error in JSON body',
    headers: { 'Content-Type': 'application/json' },
    rawBody: '{ "name": "Alice", "email": ',
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Invalid JSON request payload',
  },
  {
    id: 'JSON-1.2',
    category: 'Malformed JSON',
    description: 'Completely empty body with application/json header',
    headers: { 'Content-Type': 'application/json' },
    rawBody: '',
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Invalid JSON request payload',
  },
  {
    id: 'JSON-1.3',
    category: 'Malformed JSON',
    description: 'JSON primitive number (123) instead of object',
    headers: { 'Content-Type': 'application/json' },
    rawBody: '123',
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least',
  },
  {
    id: 'JSON-1.4',
    category: 'Malformed JSON',
    description: 'JSON primitive boolean (true) instead of object',
    headers: { 'Content-Type': 'application/json' },
    rawBody: 'true',
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least',
  },
  {
    id: 'JSON-1.5',
    category: 'Malformed JSON',
    description: 'JSON array ([1,2,3]) instead of object',
    headers: { 'Content-Type': 'application/json' },
    rawBody: '[1, 2, 3]',
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least',
  },
  {
    id: 'JSON-1.6',
    category: 'Malformed JSON',
    description: 'JSON null literal',
    headers: { 'Content-Type': 'application/json' },
    rawBody: 'null',
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least',
  },

  // ==========================================
  // Category 2: Missing & Nil Fields
  // ==========================================
  {
    id: 'MISSING-2.1',
    category: 'Missing Fields',
    description: 'Missing name field completely',
    body: { email: 'alice@example.com', message: 'This is a valid test message.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least 2 characters',
  },
  {
    id: 'MISSING-2.2',
    category: 'Missing Fields',
    description: 'Missing email field completely',
    body: { name: 'Alice Smith', message: 'This is a valid test message.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'A valid email address is required',
  },
  {
    id: 'MISSING-2.3',
    category: 'Missing Fields',
    description: 'Missing message field completely',
    body: { name: 'Alice Smith', email: 'alice@example.com' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Message must be at least 10 characters',
  },
  {
    id: 'MISSING-2.4',
    category: 'Missing Fields',
    description: 'Empty JSON object {}',
    body: {},
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least 2 characters',
  },
  {
    id: 'MISSING-2.5',
    category: 'Missing Fields',
    description: 'Explicit null for all fields',
    body: { name: null, email: null, message: null },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least 2 characters',
  },
  {
    id: 'MISSING-2.6',
    category: 'Missing Fields',
    description: 'Whitespace only for name',
    body: { name: '     ', email: 'alice@example.com', message: 'This is a valid test message.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least 2 characters',
  },
  {
    id: 'MISSING-2.7',
    category: 'Missing Fields',
    description: 'Whitespace only for message',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: '             ' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Message must be at least 10 characters',
  },

  // ==========================================
  // Category 3: Name Field Boundaries
  // ==========================================
  {
    id: 'NAME-3.1',
    category: 'Name Boundaries',
    description: 'Name boundary: 0 characters ("")',
    body: { name: '', email: 'alice@example.com', message: 'Valid test message content.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least 2 characters',
  },
  {
    id: 'NAME-3.2',
    category: 'Name Boundaries',
    description: 'Name boundary: 1 character ("A")',
    body: { name: 'A', email: 'alice@example.com', message: 'Valid test message content.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least 2 characters',
  },
  {
    id: 'NAME-3.3',
    category: 'Name Boundaries',
    description: 'Name boundary: 2 characters ("Al") [MIN VALID]',
    body: { name: 'Al', email: 'alice@example.com', message: 'Valid test message content.' },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'NAME-3.4',
    category: 'Name Boundaries',
    description: 'Name boundary: 100 characters [MAX VALID]',
    body: {
      name: 'A'.repeat(100),
      email: 'alice@example.com',
      message: 'Valid test message content.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'NAME-3.5',
    category: 'Name Boundaries',
    description: 'Name boundary: 101 characters [EXCEEDS MAX]',
    body: {
      name: 'A'.repeat(101),
      email: 'alice@example.com',
      message: 'Valid test message content.',
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must not exceed 100 characters',
  },
  {
    id: 'NAME-3.6',
    category: 'Name Boundaries',
    description: 'Name whitespace-padded 1 char ("  A  ")',
    body: { name: '  A  ', email: 'alice@example.com', message: 'Valid test message content.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must be at least 2 characters',
  },
  {
    id: 'NAME-3.7',
    category: 'Name Boundaries',
    description: 'Name whitespace-padded 2 chars ("  Al  ") [VALID TRIMMED]',
    body: { name: '  Al  ', email: 'alice@example.com', message: 'Valid test message content.' },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'NAME-3.8',
    category: 'Name Boundaries',
    description: 'Name whitespace-padded 100 chars (" " + 100 A\'s + " ") [VALID TRIMMED]',
    body: {
      name: '  ' + 'A'.repeat(100) + '  ',
      email: 'alice@example.com',
      message: 'Valid test message content.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'NAME-3.9',
    category: 'Name Boundaries',
    description: 'Name whitespace-padded 101 chars (" " + 101 A\'s + " ") [EXCEEDS TRIMMED MAX]',
    body: {
      name: '  ' + 'A'.repeat(101) + '  ',
      email: 'alice@example.com',
      message: 'Valid test message content.',
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Name must not exceed 100 characters',
  },

  // ==========================================
  // Category 4: Email Validation Boundaries
  // ==========================================
  {
    id: 'EMAIL-4.1',
    category: 'Email Validation',
    description: 'Missing @ symbol ("plainaddress")',
    body: { name: 'Alice Smith', email: 'plainaddress', message: 'Valid test message content.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'A valid email address is required',
  },
  {
    id: 'EMAIL-4.2',
    category: 'Email Validation',
    description: 'Missing domain ("user@")',
    body: { name: 'Alice Smith', email: 'user@', message: 'Valid test message content.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'A valid email address is required',
  },
  {
    id: 'EMAIL-4.3',
    category: 'Email Validation',
    description: 'Missing user part ("@example.com")',
    body: { name: 'Alice Smith', email: '@example.com', message: 'Valid test message content.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'A valid email address is required',
  },
  {
    id: 'EMAIL-4.4',
    category: 'Email Validation',
    description: 'Space in email username ("user name@example.com")',
    body: {
      name: 'Alice Smith',
      email: 'user name@example.com',
      message: 'Valid test message content.',
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'A valid email address is required',
  },
  {
    id: 'EMAIL-4.5',
    category: 'Email Validation',
    description: 'Space in email domain ("user@example .com")',
    body: {
      name: 'Alice Smith',
      email: 'user@example .com',
      message: 'Valid test message content.',
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'A valid email address is required',
  },
  {
    id: 'EMAIL-4.6',
    category: 'Email Validation',
    description: 'Missing TLD dot ("user@domain")',
    body: { name: 'Alice Smith', email: 'user@domain', message: 'Valid test message content.' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'A valid email address is required',
  },
  {
    id: 'EMAIL-4.7',
    category: 'Email Validation',
    description: 'Standard valid email ("alice@example.com")',
    body: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: 'Valid test message content.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'EMAIL-4.8',
    category: 'Email Validation',
    description: 'Valid complex tagged and multi-subdomain email',
    body: {
      name: 'Alice Smith',
      email: 'alice.smith+tag123@sub.region.example.co.in',
      message: 'Valid test message content.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'EMAIL-4.9',
    category: 'Email Validation',
    description: 'Valid email with outer whitespace (trimmed automatically)',
    body: {
      name: 'Alice Smith',
      email: '   alice@example.com   ',
      message: 'Valid test message content.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },

  // ==========================================
  // Category 5: Message Boundaries
  // ==========================================
  {
    id: 'MSG-5.1',
    category: 'Message Boundaries',
    description: 'Message boundary: 0 characters ("")',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: '' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Message must be at least 10 characters',
  },
  {
    id: 'MSG-5.2',
    category: 'Message Boundaries',
    description: 'Message boundary: 9 characters ("123456789")',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: '123456789' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Message must be at least 10 characters',
  },
  {
    id: 'MSG-5.3',
    category: 'Message Boundaries',
    description: 'Message boundary: 10 characters ("1234567890") [MIN VALID]',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: '1234567890' },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'MSG-5.4',
    category: 'Message Boundaries',
    description: 'Message boundary: 5000 characters [MAX VALID]',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: 'M'.repeat(5000) },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'MSG-5.5',
    category: 'Message Boundaries',
    description: 'Message boundary: 5001 characters [EXCEEDS MAX]',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: 'M'.repeat(5001) },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Message must not exceed 5000 characters',
  },
  {
    id: 'MSG-5.6',
    category: 'Message Boundaries',
    description: 'Message trimmed boundary: 9 chars after trimming ("   123456789   ")',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: '   123456789   ' },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Message must be at least 10 characters',
  },
  {
    id: 'MSG-5.7',
    category: 'Message Boundaries',
    description: 'Message trimmed boundary: 10 chars after trimming ("   1234567890   ")',
    body: { name: 'Alice Smith', email: 'alice@example.com', message: '   1234567890   ' },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'MSG-5.8',
    category: 'Message Boundaries',
    description: 'Message trimmed boundary: 5000 chars after trimming (" " + 5000 + " ")',
    body: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: '  ' + 'M'.repeat(5000) + '  ',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'MSG-5.9',
    category: 'Message Boundaries',
    description: 'Message trimmed boundary: 5001 chars after trimming (" " + 5001 + " ")',
    body: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: '  ' + 'M'.repeat(5001) + '  ',
    },
    expectedStatus: 400,
    expectedSuccess: false,
    expectedErrorSubstring: 'Message must not exceed 5000 characters',
  },

  // ==========================================
  // Category 6: Visitor Type Enums & Sessions
  // ==========================================
  {
    id: 'ENUM-6.1',
    category: 'Visitor Type Enum',
    description: 'Default visitorType when omitted',
    body: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: 'Valid message without visitorType.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'ENUM-6.2',
    category: 'Visitor Type Enum',
    description: 'Valid visitorType: "developer"',
    body: {
      name: 'Alice Developer',
      email: 'alice@example.com',
      message: 'Valid message from developer.',
      visitorType: 'developer',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'ENUM-6.3',
    category: 'Visitor Type Enum',
    description: 'Valid visitorType: "recruiter"',
    body: {
      name: 'Bob Recruiter',
      email: 'bob@example.com',
      message: 'Valid message from recruiter.',
      visitorType: 'recruiter',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'ENUM-6.4',
    category: 'Visitor Type Enum',
    description: 'Valid visitorType: "student"',
    body: {
      name: 'Charlie Student',
      email: 'charlie@example.com',
      message: 'Valid message from student.',
      visitorType: 'student',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'ENUM-6.5',
    category: 'Visitor Type Enum',
    description: 'Valid visitorType: "explorer"',
    body: {
      name: 'Dave Explorer',
      email: 'dave@example.com',
      message: 'Valid message from explorer.',
      visitorType: 'explorer',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'ENUM-6.6',
    category: 'Visitor Type Enum',
    description: 'Invalid visitorType enum string ("superuser") gracefully defaults to developer',
    body: {
      name: 'Evil Superuser',
      email: 'evil@example.com',
      message: 'Valid message with bad visitorType.',
      visitorType: 'superuser',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'ENUM-6.7',
    category: 'Visitor Type Enum',
    description: 'Non-string visitorType (number 999) gracefully defaults to developer',
    body: {
      name: 'Dave Number',
      email: 'dave@example.com',
      message: 'Valid message with numeric visitorType.',
      visitorType: 999,
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'ENUM-6.8',
    category: 'Visitor Type Enum',
    description: 'Valid optional sessionId included',
    body: {
      name: 'Dave Session',
      email: 'dave@example.com',
      message: 'Valid message with sessionId.',
      sessionId: 'sess_abc123_xyz789',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },

  // ==========================================
  // Category 7: Security & Injection Payloads
  // ==========================================
  {
    id: 'SEC-7.1',
    category: 'Security & Injections',
    description: 'XSS HTML script tag in Name field',
    body: {
      name: '<script>alert("XSS")</script>',
      email: 'alice@example.com',
      message: 'Testing HTML injection resiliency.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'SEC-7.2',
    category: 'Security & Injections',
    description: 'XSS image onerror vector in Message field',
    body: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: '<img src="x" onerror="alert(document.cookie)"> Injection test message.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'SEC-7.3',
    category: 'Security & Injections',
    description: 'SQL Injection attempt in Name field',
    body: {
      name: "Robert'); DROP TABLE visitor_messages;--",
      email: 'alice@example.com',
      message: 'Testing SQL injection resilience in name.',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'SEC-7.4',
    category: 'Security & Injections',
    description: 'SQL Injection classic boolean tautology in Message',
    body: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      message: "' OR '1'='1' UNION SELECT username, password FROM users --",
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'SEC-7.5',
    category: 'Security & Injections',
    description: 'Unicode, Multi-byte Emojis, and RTL characters',
    body: {
      name: '🚀 Shaik Rohit 👨‍💻 مرحبا',
      email: 'rohit@example.com',
      message: '✨ Full multi-byte unicode stress test with emojis 🌟 and symbols #@!%^&*()',
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },
  {
    id: 'SEC-7.6',
    category: 'Security & Injections',
    description: 'Prototype pollution and unexpected arbitrary keys',
    body: {
      name: 'Pollution Tester',
      email: 'tester@example.com',
      message: 'Testing extra keys and pollution defense.',
      __proto__: { isAdmin: true },
      constructor: { prototype: { isAdmin: true } },
      role: 'admin',
      isAuthorized: true,
    },
    expectedStatus: 200,
    expectedSuccess: true,
  },

  // ==========================================
  // Category 8: HTTP Method Verification
  // ==========================================
  {
    id: 'HTTP-8.1',
    category: 'HTTP Method Verifications',
    description: 'GET request to POST-only route',
    method: 'GET',
    expectedStatus: 405,
  },
];

async function runTests() {
  console.log(`Starting Empirical Adversarial Test Suite against ${API_URL}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  let passedCount = 0;
  let failedCount = 0;
  const results = [];

  for (const tc of testCases) {
    const method = tc.method || 'POST';
    const headers = tc.headers || { 'Content-Type': 'application/json' };
    let bodyPayload = undefined;

    if (method !== 'GET') {
      if (tc.rawBody !== undefined) {
        bodyPayload = tc.rawBody;
      } else if (tc.body !== undefined) {
        bodyPayload = JSON.stringify(tc.body);
      }
    }

    const startTime = performance.now();
    let status = 0;
    let jsonResp = null;
    let rawText = '';
    let pass = false;
    let failureReason = '';

    try {
      const res = await fetch(API_URL, {
        method,
        headers,
        body: bodyPayload,
      });

      status = res.status;
      rawText = await res.text();
      try {
        jsonResp = JSON.parse(rawText);
      } catch {
        jsonResp = null;
      }

      const elapsedMs = Math.round(performance.now() - startTime);

      // Check Status Code
      if (status !== tc.expectedStatus) {
        failureReason = `Expected status ${tc.expectedStatus}, got ${status}`;
      }
      // Check Success field if JSON
      else if (tc.expectedSuccess !== undefined && jsonResp?.success !== tc.expectedSuccess) {
        failureReason = `Expected success=${tc.expectedSuccess}, got ${jsonResp?.success}`;
      }
      // Check Error message substring if specified
      else if (
        tc.expectedErrorSubstring &&
        (!jsonResp?.error || !jsonResp.error.includes(tc.expectedErrorSubstring))
      ) {
        failureReason = `Expected error substring "${tc.expectedErrorSubstring}", got "${jsonResp?.error}"`;
      } else {
        pass = true;
      }

      if (pass) {
        passedCount++;
        console.log(`[PASS] ${tc.id} (${tc.category}): ${tc.description} [HTTP ${status}] (${elapsedMs}ms)`);
      } else {
        failedCount++;
        console.error(
          `[FAIL] ${tc.id} (${tc.category}): ${tc.description}\n` +
          `       Reason: ${failureReason}\n` +
          `       Response: HTTP ${status} -> ${rawText.slice(0, 200)}`
        );
      }

      results.push({
        id: tc.id,
        category: tc.category,
        description: tc.description,
        pass,
        status,
        expectedStatus: tc.expectedStatus,
        failureReason,
        response: jsonResp || rawText,
        elapsedMs,
      });
    } catch (err) {
      failedCount++;
      failureReason = `Fetch error: ${err.message}`;
      console.error(`[ERROR] ${tc.id}: ${failureReason}`);
      results.push({
        id: tc.id,
        category: tc.category,
        description: tc.description,
        pass: false,
        status: 0,
        expectedStatus: tc.expectedStatus,
        failureReason,
        elapsedMs: 0,
      });
    }
  }

  console.log('\n=========================================');
  console.log(`EMPIRICAL RESULTS: ${passedCount} PASSED, ${failedCount} FAILED (Total: ${testCases.length})`);
  console.log('=========================================');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
