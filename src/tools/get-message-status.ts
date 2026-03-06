import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';
import { formatError } from '../lib/errors.js';

export function registerGetMessageStatus(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'get_message_status',
    'Check the delivery status and event history of a previously sent message.',
    {
      messageId: z.string().describe('The message ID (e.g. msg_01H8XKJM3V9BQNFR7T4C5WPZEY)'),
    },
    async (args) => {
      try {
        const result = await dispatch.getMessageStatus(args.messageId);
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
