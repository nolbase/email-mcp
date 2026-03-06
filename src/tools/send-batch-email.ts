import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

const emailSchema = z.object({
  to: z.string().describe('Recipient email address'),
  subject: z.string().optional().describe('Email subject line'),
  html: z.string().optional().describe('HTML email body'),
  text: z.string().optional().describe('Plain text email body'),
  templateSlug: z.string().optional().describe('Template slug'),
  templateVars: z.record(z.unknown()).optional().describe('Template variables'),
  from: z.string().optional().describe('Sender email address'),
  replyTo: z.string().optional().describe('Reply-to email address'),
  priority: z.enum(['CRITICAL', 'HIGH', 'NORMAL']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export function registerSendBatchEmail(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'send_batch_email',
    'Send up to 100 emails in a single batch request. Each email can use inline content or a template.',
    {
      emails: z.array(emailSchema).min(1).max(100).describe('Array of email objects to send'),
    },
    async (args) => {
      try {
        const results = await dispatch.email.sendBatch(args.emails);
        return {
          content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
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
