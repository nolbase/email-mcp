import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

export function registerSendEmail(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'send_email',
    'Send a transactional email. Provide inline content (subject + html/text) OR a templateSlug with templateVars.',
    {
      to: z.string().describe('Recipient email address'),
      subject: z.string().optional().describe('Email subject line (required if not using a template)'),
      html: z.string().optional().describe('HTML email body'),
      text: z.string().optional().describe('Plain text email body'),
      templateSlug: z.string().optional().describe('Template slug to use instead of inline content'),
      templateVars: z.record(z.unknown()).optional().describe('Variables to substitute in the template'),
      from: z.string().optional().describe('Sender email address (must be from a verified domain)'),
      replyTo: z.string().optional().describe('Reply-to email address'),
      cc: z.array(z.string()).optional().describe('CC recipient email addresses'),
      bcc: z.array(z.string()).optional().describe('BCC recipient email addresses'),
      priority: z.enum(['CRITICAL', 'HIGH', 'NORMAL']).optional().describe('Message priority'),
      metadata: z.record(z.unknown()).optional().describe('Custom metadata key-value pairs'),
    },
    async (args) => {
      try {
        const result = await dispatch.email.send(args);
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
