import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

export function registerValidateTemplate(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'validate_template',
    'Check if the provided variables satisfy a template\'s requirements. Returns missing and extra variables.',
    {
      slug: z.string().describe('Template slug'),
      channel: z.enum(['EMAIL', 'SMS']).describe('Template channel'),
      variables: z.record(z.unknown()).describe('Variables to validate against the template'),
    },
    async (args) => {
      try {
        const result = await dispatch.templates.validate(
          args.slug,
          args.channel,
          args.variables
        );
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
