#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main() {
  const apiKey = process.env.DISPATCH_API_KEY;

  if (!apiKey) {
    console.error('Error: DISPATCH_API_KEY environment variable is required.');
    console.error('Set it to your Dispatch API key (starts with dp_live_ or dp_test_).');
    process.exit(1);
  }

  if (!apiKey.startsWith('dp_live_') && !apiKey.startsWith('dp_test_')) {
    console.error('Error: Invalid API key format.');
    console.error('API keys must start with dp_live_ (production) or dp_test_ (sandbox).');
    process.exit(1);
  }

  const server = createServer(apiKey);
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
