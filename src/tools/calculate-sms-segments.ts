import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { Dispatch } from '@nolbase/dispatch';

export function registerCalculateSmsSegments(server: McpServer, dispatch: Dispatch) {
  server.tool(
    'calculate_sms_segments',
    'Calculate how many SMS segments a message will use. Useful for cost estimation. This runs locally and does not make an API call.',
    {
      text: z.string().describe('The SMS text content to analyze'),
    },
    async (args) => {
      const segments = dispatch.sms.calculateSegments(args.text);
      const charCount = args.text.length;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                text: args.text,
                characters: charCount,
                segments,
                encoding: charCount <= 160 && segments === 1 ? 'GSM-7' : 'auto-detected',
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
