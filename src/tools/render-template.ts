import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

export function registerRenderTemplate(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'render_template',
    'Preview a template rendered with the given variables. Returns the final subject, text, and/or HTML content.',
    {
      slug: z.string().describe('Template slug'),
      channel: z.enum(['EMAIL', 'SMS']).describe('Template channel'),
      variables: z.record(z.unknown()).optional().describe('Variables to substitute in the template'),
    },
    async (args) => {
      try {
        const result = await dispatch.templates.render({
          slug: args.slug,
          channel: args.channel,
          variables: args.variables ?? {},
        });
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
