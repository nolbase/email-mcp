import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

export function registerListTemplates(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'list_templates',
    'List available message templates. Optionally filter by channel (EMAIL or SMS) or search by name.',
    {
      channel: z.enum(['EMAIL', 'SMS']).optional().describe('Filter by channel'),
      isActive: z.boolean().optional().describe('Filter by active status'),
      search: z.string().optional().describe('Search templates by name'),
    },
    async (args) => {
      try {
        const results = await dispatch.templates.list(args);
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
