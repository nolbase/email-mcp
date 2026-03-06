import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

export function registerSendSms(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'send_sms',
    'Send an SMS message. Provide inline text OR a templateSlug with templateVars. Phone number must be in E.164 format (e.g. +14155551234).',
    {
      to: z.string().describe('Recipient phone number in E.164 format (e.g. +14155551234)'),
      text: z.string().optional().describe('SMS text content (max 1600 characters)'),
      templateSlug: z.string().optional().describe('Template slug to use instead of inline text'),
      templateVars: z.record(z.unknown()).optional().describe('Variables to substitute in the template'),
      from: z.string().optional().describe('Sender ID (must be registered and approved)'),
      priority: z.enum(['CRITICAL', 'HIGH', 'NORMAL']).optional().describe('Message priority'),
      metadata: z.record(z.unknown()).optional().describe('Custom metadata key-value pairs'),
    },
    async (args) => {
      try {
        const result = await dispatch.sms.send(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: formatError(error) }],
          isError: true,
        };
      }
    }
  );
}
