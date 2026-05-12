# Coree VS Code Integration

[Coree](https://github.com/coree-ai/coree) provides persistent memory and code intelligence for AI agents. This repository contains the MCP server configuration and context file for integrating Coree into [VS Code](https://code.visualstudio.com) agent features (GitHub Copilot).

## Features

- **Persistent Memory**: Stores decisions, architectural discoveries, and gotchas across sessions.
- **Code Intelligence**: Hybrid search over source code and git history.

## Requirements

VS Code MCP support requires GitHub Copilot and a VS Code version that includes
agent mode.

## Installation

### 1. Add the MCP server config

**Project scope** - create or edit `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "coree": {
      "type": "stdio",
      "command": "npx",
      "args": ["--yes", "@coree-ai/coree@0.13.0", "serve"]
    }
  }
}
```

VS Code picks this up automatically when you open the project.

**User scope** - add to your VS Code `settings.json`
(`Ctrl+Shift+P` > "Open User Settings JSON"):

```json
{
  "mcp": {
    "servers": {
      "coree": {
        "type": "stdio",
        "command": "npx",
        "args": ["--yes", "@coree-ai/coree@0.13.0", "serve"]
      }
    }
  }
}
```

After adding the config, the coree server will appear in the MCP servers list in
the agent panel. If it shows as disconnected, use "Restart MCP Server" from the
command palette.

### 2. Add the context file to your project

Copy `.github/copilot-instructions.md` from this repository into your project:

```bash
mkdir -p .github
curl -fsSL https://raw.githubusercontent.com/coree-ai/vscode/main/.github/copilot-instructions.md \
  -o .github/copilot-instructions.md
```

VS Code Copilot automatically loads `.github/copilot-instructions.md` as agent
instructions. If you already have this file, append the contents.

## Environment variables

If you use coree's remote sync (Turso), add env vars to the MCP config:

```json
{
  "servers": {
    "coree": {
      "type": "stdio",
      "command": "npx",
      "args": ["--yes", "@coree-ai/coree@0.13.0", "serve"],
      "env": {
        "COREE__MEMORY__REMOTE_AUTH_TOKEN": "your-token",
        "COREE__MEMORY__REMOTE_URL": "libsql://your-db.turso.io"
      }
    }
  }
}
```

## Verify

In an agent session:

```
call the coree diagnose tool
```

The `diagnose` MCP tool reports server state, database status, and any
initialisation errors.

## Usage

Once configured, Coree provides MCP tools. Ask Copilot to search your codebase
or memories:

```
search for how the indexing works
```

See [.github/copilot-instructions.md](./.github/copilot-instructions.md) for
detailed usage guidelines.
