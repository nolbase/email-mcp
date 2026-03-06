import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerDocResources(server: McpServer) {
  server.resource('quickstart', 'dispatch://docs/quickstart', {
    description: 'Getting started with Dispatch: install SDK, send your first email and SMS',
    mimeType: 'text/markdown',
  }, async () => ({
    contents: [{
      uri: 'dispatch://docs/quickstart',
      mimeType: 'text/markdown',
      text: QUICKSTART_DOC,
    }],
  }));

  server.resource('api-reference', 'dispatch://docs/api-reference', {
    description: 'Complete REST API reference: endpoints, request/response formats, authentication',
    mimeType: 'text/markdown',
  }, async () => ({
    contents: [{
      uri: 'dispatch://docs/api-reference',
      mimeType: 'text/markdown',
      text: API_REFERENCE_DOC,
    }],
  }));

  server.resource('webhooks', 'dispatch://docs/webhooks', {
    description: 'Webhook events, payload schemas, signature verification, and retry policies',
    mimeType: 'text/markdown',
  }, async () => ({
    contents: [{
      uri: 'dispatch://docs/webhooks',
      mimeType: 'text/markdown',
      text: WEBHOOKS_DOC,
    }],
  }));

  server.resource('domains', 'dispatch://docs/domains', {
    description: 'Domain authentication setup: SPF, DKIM, and DMARC configuration',
    mimeType: 'text/markdown',
  }, async () => ({
    contents: [{
      uri: 'dispatch://docs/domains',
      mimeType: 'text/markdown',
      text: DOMAINS_DOC,
    }],
  }));

  server.resource('sdk', 'dispatch://docs/sdk', {
    description: 'SDK installation, initialization, and usage patterns for all methods',
    mimeType: 'text/markdown',
  }, async () => ({
    contents: [{
      uri: 'dispatch://docs/sdk',
      mimeType: 'text/markdown',
      text: SDK_DOC,
    }],
  }));

  server.resource('errors', 'dispatch://docs/errors', {
    description: 'Error codes, HTTP status codes, and troubleshooting guide',
    mimeType: 'text/markdown',
  }, async () => ({
    contents: [{
      uri: 'dispatch://docs/errors',
      mimeType: 'text/markdown',
      text: ERRORS_DOC,
    }],
  }));
}

// ---------------------------------------------------------------------------
// Documentation content
// ---------------------------------------------------------------------------

const QUICKSTART_DOC = `# Dispatch Quickstart

## 1. Install the SDK

\`\`\`bash
npm install @nolbase/dispatch
\`\`\`

## 2. Get your API key

Create an API key from **Dashboard > Dispatch > API Keys**.
- Production keys start with \`dp_live_\`
- Test/sandbox keys start with \`dp_test_\`

## 3. Send your first email

\`\`\`typescript
import { Dispatch } from '@nolbase/dispatch';

const dispatch = new Dispatch('dp_live_your_api_key');

const result = await dispatch.email.send({
  to: 'recipient@example.com',
  subject: 'Hello from Dispatch!',
  html: '<h1>Welcome!</h1><p>Your first email sent via Dispatch.</p>',
});

console.log('Message ID:', result.id);
console.log('Status:', result.status); // "QUEUED"
\`\`\`

## 4. Send your first SMS

\`\`\`typescript
const sms = await dispatch.sms.send({
  to: '+14155551234',
  text: 'Your verification code is 482901. Expires in 10 minutes.',
  priority: 'CRITICAL',
});

console.log('SMS ID:', sms.id);
console.log('Segments:', sms.segments);
\`\`\`

## 5. Send using a template

\`\`\`typescript
const result = await dispatch.email.send({
  to: 'recipient@example.com',
  templateSlug: 'order-confirmation',
  templateVars: {
    customerName: 'Jane Doe',
    orderId: 'ORD-12345',
    total: '$99.00',
  },
});
\`\`\`

## 6. Check message status

\`\`\`typescript
const status = await dispatch.getMessageStatus('msg_01H8XKJM3V9BQNFR7T4C5WPZEY');
console.log(status.status);     // "DELIVERED"
console.log(status.deliveredAt); // "2026-03-01T12:00:02.000Z"
\`\`\`
`;

const API_REFERENCE_DOC = `# Dispatch API Reference

## Base URL

\`\`\`
https://api.dispatch.nolbase.io/v1
\`\`\`

## Authentication

All requests require a Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

API keys start with \`dp_live_\` (production) or \`dp_test_\` (sandbox).

## Endpoints

### POST /messages/email
Send a single email message.

**Request body:**
\`\`\`json
{
  "to": "recipient@example.com",
  "from": "you@yourdomain.com",
  "subject": "Order Confirmation",
  "html": "<h1>Thank you!</h1><p>Your order has been confirmed.</p>",
  "text": "Thank you! Your order has been confirmed.",
  "replyTo": "support@yourdomain.com",
  "priority": "NORMAL",
  "metadata": { "orderId": "12345" }
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "msg_01H8XKJM3V9BQNFR7T4C5WPZEY",
  "status": "QUEUED",
  "to": "recipient@example.com",
  "from": "you@yourdomain.com",
  "queuedAt": "2026-03-01T12:00:00.000Z"
}
\`\`\`

### POST /messages/sms
Send a single SMS message.

**Request body:**
\`\`\`json
{
  "to": "+14155551234",
  "text": "Your verification code is 482901.",
  "priority": "CRITICAL"
}
\`\`\`

### POST /messages/email (with template)
Send an email using a saved template.

**Request body:**
\`\`\`json
{
  "to": "recipient@example.com",
  "templateSlug": "order-confirmation",
  "templateVars": {
    "customerName": "Jane Doe",
    "orderId": "ORD-12345",
    "total": "$99.00"
  }
}
\`\`\`

### POST /messages/email/batch
Send up to 100 email messages in a single request. Request body is an array of email objects.

### POST /messages/sms/batch
Send up to 100 SMS messages in a single request. Request body is an array of SMS objects.

### GET /messages/:id
Retrieve the status and event history of a previously sent message.

**Response:**
\`\`\`json
{
  "id": "msg_01H8XKJM3V9BQNFR7T4C5WPZEY",
  "channel": "EMAIL",
  "status": "DELIVERED",
  "from": "you@yourdomain.com",
  "to": "recipient@example.com",
  "queuedAt": "2026-03-01T12:00:00.000Z",
  "sentAt": "2026-03-01T12:00:01.000Z",
  "deliveredAt": "2026-03-01T12:00:02.000Z",
  "events": [
    { "type": "QUEUED", "timestamp": "2026-03-01T12:00:00.000Z" },
    { "type": "SENT", "timestamp": "2026-03-01T12:00:01.000Z" },
    { "type": "DELIVERED", "timestamp": "2026-03-01T12:00:02.000Z" }
  ]
}
\`\`\`

### GET /templates
List templates. Query params: \`channel\` (EMAIL|SMS), \`isActive\` (boolean), \`search\` (string).

### GET /templates/:channel/:slug
Get a specific template by channel and slug.

### POST /templates/:channel/:slug/render
Render a template with variables. Request body: \`{ "variables": { ... } }\`
`;

const WEBHOOKS_DOC = `# Dispatch Webhooks

## Overview

When events occur (email delivered, SMS failed, link clicked), Dispatch sends an HTTP POST to your configured webhook URL with a JSON payload.

Configure webhooks in **Dashboard > Dispatch > Webhooks**.

## Endpoint Requirements

- Must accept HTTP POST with JSON body
- Must return 2xx within 10 seconds
- Must be served over HTTPS in production

## Event Types

### Email Events
| Event | Description |
|-------|-------------|
| EMAIL_QUEUED | Email added to send queue |
| EMAIL_SENT | Email sent to recipient mail server |
| EMAIL_DELIVERED | Email delivered to inbox |
| EMAIL_BOUNCED | Email bounced (hard or soft) |
| EMAIL_REJECTED | Email rejected (e.g. suppressed address) |
| EMAIL_DEFERRED | Email temporarily delayed, will retry |
| EMAIL_OPENED | Recipient opened email (tracking pixel) |
| EMAIL_CLICKED | Recipient clicked a tracked link |
| EMAIL_COMPLAINT | Recipient marked email as spam |

### SMS Events
| Event | Description |
|-------|-------------|
| SMS_QUEUED | SMS added to send queue |
| SMS_SENT | SMS sent to carrier |
| SMS_DELIVERED | SMS delivered to device |
| SMS_FAILED | SMS delivery failed after all retries |
| SMS_EXPIRED | SMS expired before delivery confirmed |

## Webhook Payload

\`\`\`json
{
  "event": "EMAIL_DELIVERED",
  "timestamp": "2026-03-01T12:00:02.000Z",
  "messageId": "msg_01H8XKJM3V9BQNFR7T4C5WPZEY",
  "to": "recipient@example.com",
  "channel": "EMAIL",
  "status": "DELIVERED",
  "deliveredAt": "2026-03-01T12:00:02.000Z",
  "metadata": {
    "campaignId": "camp_123",
    "userId": "usr_456"
  }
}
\`\`\`

## Signature Verification

Every webhook includes an \`X-Dispatch-Signature\` header (HMAC-SHA256 of the raw body using your webhook signing secret).

\`\`\`typescript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf-8')
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
\`\`\`

## Retry Policy

| Attempt | Delay | Notes |
|---------|-------|-------|
| 1st retry | 30 seconds | First retry after failure |
| 2nd retry | 5 minutes | Exponential backoff |
| 3rd retry | 30 minutes | Final attempt |

After 3 failed retries, the event is marked as failed. View and manually retry from **Dashboard > Dispatch > Webhooks > Failed Events**.
`;

const DOMAINS_DOC = `# Domain Authentication

Authenticate your sending domain to improve email deliverability and prevent spoofing.

## Step 1: Add Your Domain

In **Dashboard > Dispatch > Domains**, click **Add Domain** and enter your sending domain.

Add the verification TXT record:
\`\`\`
Host: yourdomain.com
Value: nolbase-verify=<token from dashboard>
\`\`\`

## Step 2: Configure SPF

Add a TXT record to authorize Dispatch to send on your behalf:

| Type | Host | Value |
|------|------|-------|
| TXT | @ | \`v=spf1 include:_spf.nolbase.io ~all\` |

If you already have an SPF record, add the include before \`~all\`:
\`\`\`
v=spf1 include:_spf.google.com include:_spf.nolbase.io ~all
\`\`\`

## Step 3: Configure DKIM

Add CNAME records for DKIM signing:

| Type | Host | Value |
|------|------|-------|
| CNAME | dispatch1._domainkey | dispatch1._domainkey.nolbase.io |
| CNAME | dispatch2._domainkey | dispatch2._domainkey.nolbase.io |

## Step 4: Configure DMARC

Add a TXT record for DMARC policy:

| Type | Host | Value |
|------|------|-------|
| TXT | _dmarc | \`v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100\` |

Policy options: \`p=none\` (monitor), \`p=quarantine\` (spam), \`p=reject\` (reject).

## Step 5: Verify

Return to **Dashboard > Dispatch > Domains** and click **Verify Domain**. DNS propagation can take up to 48 hours.
`;

const SDK_DOC = `# Dispatch SDK

## Installation

\`\`\`bash
npm install @nolbase/dispatch
\`\`\`

## Initialization

\`\`\`typescript
import { Dispatch } from '@nolbase/dispatch';

const dispatch = new Dispatch('dp_live_your_api_key');
\`\`\`

API keys: \`dp_live_\` for production, \`dp_test_\` for sandbox.

## Configuration Options

\`\`\`typescript
const dispatch = new Dispatch('dp_live_...', {
  baseUrl: 'https://api.dispatch.nolbase.io', // default
  timeout: 30000,   // 30s default
  maxRetries: 3,    // auto-retry on 5xx and 429
  headers: {},      // custom headers
});
\`\`\`

## Email

### Send email
\`\`\`typescript
const result = await dispatch.email.send({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Hello</h1>',
  text: 'Hello (plain text fallback)',
  from: 'you@yourdomain.com',    // optional
  replyTo: 'support@domain.com', // optional
  cc: ['cc@example.com'],        // optional
  bcc: ['bcc@example.com'],      // optional
  priority: 'NORMAL',            // CRITICAL | HIGH | NORMAL
  metadata: { orderId: '123' },  // optional
});
\`\`\`

### Send email with template
\`\`\`typescript
const result = await dispatch.email.send({
  to: 'user@example.com',
  templateSlug: 'order-confirmation',
  templateVars: { customerName: 'Jane', orderId: 'ORD-123' },
});
\`\`\`

### Batch send (up to 100)
\`\`\`typescript
const results = await dispatch.email.sendBatch([
  { to: 'user1@example.com', subject: 'Hi', html: '<p>Hello 1</p>' },
  { to: 'user2@example.com', subject: 'Hi', html: '<p>Hello 2</p>' },
]);
\`\`\`

## SMS

### Send SMS
\`\`\`typescript
const result = await dispatch.sms.send({
  to: '+14155551234',
  text: 'Your code is 482901',
  priority: 'CRITICAL',
});
\`\`\`

### Calculate segments
\`\`\`typescript
const segments = dispatch.sms.calculateSegments('Hello World!');
// Returns: 1
\`\`\`

### Batch send (up to 100)
\`\`\`typescript
const results = await dispatch.sms.sendBatch([
  { to: '+14155551234', text: 'Hello 1' },
  { to: '+14155555678', text: 'Hello 2' },
]);
\`\`\`

## Templates

### List templates
\`\`\`typescript
const templates = await dispatch.templates.list();
const emailOnly = await dispatch.templates.list({ channel: 'EMAIL' });
\`\`\`

### Get template
\`\`\`typescript
const template = await dispatch.templates.get('welcome-email', 'EMAIL');
\`\`\`

### Render template
\`\`\`typescript
const rendered = await dispatch.templates.render({
  slug: 'welcome-email',
  channel: 'EMAIL',
  variables: { name: 'John' },
});
\`\`\`

### Validate template variables
\`\`\`typescript
const result = await dispatch.templates.validate('welcome-email', 'EMAIL', {
  name: 'John',
});
// { valid: true, missing: [], extra: [] }
\`\`\`

## Message Status

\`\`\`typescript
const status = await dispatch.getMessageStatus('msg_01H8...');
// status.status: QUEUED | SENDING | SENT | DELIVERED | FAILED | BOUNCED | COMPLAINED
// status.events: [{ type, timestamp }]
\`\`\`

## Error Handling

\`\`\`typescript
try {
  await dispatch.email.send({ to: 'invalid', subject: 'Test', text: 'Hi' });
} catch (error) {
  if (error.name === 'DispatchError') {
    console.log(error.code);       // e.g. "VALIDATION_ERROR"
    console.log(error.statusCode); // e.g. 400
    console.log(error.message);    // Human-readable message
  }
}
\`\`\`

The SDK automatically retries on 429 (rate limit) and 5xx errors with exponential backoff.
`;

const ERRORS_DOC = `# Dispatch Error Codes

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Request succeeded |
| 201 | Resource created (message queued) |
| 400 | Bad request — check request body for validation errors |
| 401 | Unauthorized — invalid or missing API key |
| 403 | Forbidden — API key lacks permission |
| 404 | Resource not found |
| 429 | Rate limit exceeded — retry after Retry-After header |
| 500 | Internal server error — contact support if persistent |
| 503 | Service temporarily unavailable — retry with backoff |

## SDK Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Invalid request parameters |
| RATE_LIMITED | Rate limit exceeded (auto-retried by SDK) |
| TIMEOUT | Request timed out (default: 30s) |
| NETWORK_ERROR | Network connectivity issue |
| API_ERROR | Generic API error |

## Rate Limits

- Default: varies by plan
- Rate limit headers: \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`, \`Retry-After\`
- The SDK automatically retries rate-limited requests with exponential backoff

## Troubleshooting

### "Invalid API key format"
API keys must start with \`dp_live_\` (production) or \`dp_test_\` (sandbox).

### "Recipient (to) is required"
The \`to\` field is required for all send operations.

### "Either subject/text/html or templateSlug is required"
When sending email, provide either inline content (subject + html/text) or a templateSlug.

### "Invalid phone number"
SMS recipients must be in E.164 format: \`+\` followed by country code and number (e.g. \`+14155551234\`).

### "Maximum 100 emails per batch"
Batch operations are limited to 100 messages per request.
`;
