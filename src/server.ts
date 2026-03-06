import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Dispatch } from '@nolbase/dispatch';

import { registerSendEmail } from './tools/send-email.js';
import { registerSendSms } from './tools/send-sms.js';
import { registerSendBatchEmail } from './tools/send-batch-email.js';
import { registerSendBatchSms } from './tools/send-batch-sms.js';
import { registerGetMessageStatus } from './tools/get-message-status.js';
import { registerListTemplates } from './tools/list-templates.js';
import { registerRenderTemplate } from './tools/render-template.js';
import { registerValidateTemplate } from './tools/validate-template.js';
import { registerCalculateSmsSegments } from './tools/calculate-sms-segments.js';
import { registerDocResources } from './resources/docs.js';

export function createServer(apiKey: string): McpServer {
  const dispatch = new Dispatch(apiKey);

  const server = new McpServer({
    name: 'dispatch',
    version: '1.0.0',
  });

  // Register tools
  registerSendEmail(server, dispatch);
  registerSendSms(server, dispatch);
  registerSendBatchEmail(server, dispatch);
  registerSendBatchSms(server, dispatch);
  registerGetMessageStatus(server, dispatch);
  registerListTemplates(server, dispatch);
  registerRenderTemplate(server, dispatch);
  registerValidateTemplate(server, dispatch);
  registerCalculateSmsSegments(server, dispatch);

  // Register documentation resources
  registerDocResources(server);

  return server;
}
