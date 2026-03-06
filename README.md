# @nolbase/dispatch-mcp-server

MCP (Model Context Protocol) server for [NolBase Dispatch](https://dispatch.nolbase.io) — send transactional email and SMS directly from AI coding assistants like Claude, Cursor, and VS Code Copilot.

## Quick Start

```bash
npx @nolbase/dispatch-mcp-server
```

The server reads your API key from the `DISPATCH_API_KEY` environment variable.

## IDE Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dispatch": {
      "command": "npx",
      "args": ["@nolbase/dispatch-mcp-server"],
      "env": {
        "DISPATCH_API_KEY": "dp_live_your_api_key"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "dispatch": {
      "command": "npx",
      "args": ["@nolbase/dispatch-mcp-server"],
      "env": {
        "DISPATCH_API_KEY": "dp_live_your_api_key"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "dispatch": {
      "command": "npx",
      "args": ["@nolbase/dispatch-mcp-server"],
      "env": {
        "DISPATCH_API_KEY": "dp_live_your_api_key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `send_email` | Send a transactional email (inline or template) |
| `send_sms` | Send an SMS message |
| `send_batch_email` | Send up to 100 emails in one request |
| `send_batch_sms` | Send up to 100 SMS messages in one request |
| `get_message_status` | Check delivery status of a sent message |
| `list_templates` | List available message templates |
| `render_template` | Preview a template with variables |
| `validate_template` | Check if variables satisfy template requirements |
| `calculate_sms_segments` | Calculate SMS segment count for cost estimation |

## Available Resources

| Resource | URI | Description |
|----------|-----|-------------|
| Quickstart | `dispatch://docs/quickstart` | Getting started guide |
| API Reference | `dispatch://docs/api-reference` | REST API endpoints |
| Webhooks | `dispatch://docs/webhooks` | Event types and payloads |
| Domains | `dispatch://docs/domains` | Domain authentication setup |
| SDK | `dispatch://docs/sdk` | SDK usage patterns |
| Errors | `dispatch://docs/errors` | Error codes and troubleshooting |

## API Keys

- **Production**: `dp_live_...` — sends real messages
- **Sandbox**: `dp_test_...` — messages are validated but not delivered

Get your API key from **Dashboard > Dispatch > API Keys** at [dispatch.nolbase.io](https://dispatch.nolbase.io).

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Type check
npm run typecheck

# Test with MCP Inspector
npx @modelcontextprotocol/inspector npx @nolbase/dispatch-mcp-server
```

## License

MIT
