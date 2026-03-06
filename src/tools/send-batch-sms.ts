import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

const smsSchema = z.object({
  to: z.string().describe('Recipient phone number in E.164 format'),
  text: z.string().optional().describe('SMS text content'),
  templateSlug: z.string().optional().describe('Template slug'),
  templateVars: z.record(z.unknown()).optional().describe('Template variables'),
  from: z.string().optional().describe('Sender ID'),
  priority: z.enum(['CRITICAL', 'HIGH', 'NORMAL']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export function registerSendBatchSms(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'send_batch_sms',
    'Send up to 100 SMS messages in a single batch request.',
    {
      messages: z.array(smsSchema).min(1).max(100).describe('Array of SMS objects to send'),
    },
    async (args) => {
      try {
        const results = await dispatch.sms.sendBatch(args.messages);
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
