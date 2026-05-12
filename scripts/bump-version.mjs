import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function replaceInFile(p, oldStr, newStr) {
  const content = fs.readFileSync(p, 'utf8');
  const newContent = content.replaceAll(oldStr, newStr);
  fs.writeFileSync(p, newContent);
}

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: node scripts/bump-version.mjs <new-version>');
  process.exit(1);
}

const newVersion = args[0];

// Derive current version from .vscode/mcp.json
const mcpPath = path.join(REPO_ROOT, '.vscode/mcp.json');
const mcp = readJson(mcpPath);
const currentArg = mcp.servers.coree.args.find(a => a.includes('@coree-ai/coree@'));
if (!currentArg) {
  console.error('Could not find @coree-ai/coree@ version in .vscode/mcp.json');
  process.exit(1);
}
const currentVersion = currentArg.split('@coree-ai/coree@')[1];

mcp.servers.coree.args = mcp.servers.coree.args.map(a =>
  a.includes('@coree-ai/coree@') ? `@coree-ai/coree@${newVersion}` : a
);
writeJson(mcpPath, mcp);

replaceInFile(path.join(REPO_ROOT, 'README.md'), currentVersion, newVersion);

console.log(`Bumped VS Code integration from ${currentVersion} to ${newVersion}`);
console.log(`Updated MCP server reference to @coree-ai/coree@${newVersion}`);
