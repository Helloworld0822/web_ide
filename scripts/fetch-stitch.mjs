import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PROJECT_ID = '15574620659983089772';
const OUT_DIR = join(process.cwd(), 'stitch-export');

function loadApiKey() {
  if (process.env.STITCH_API_KEY) return process.env.STITCH_API_KEY;
  const paths = [
    join(process.cwd(), '.cursor', 'mcp.json'),
    join(homedir(), '.cursor', 'mcp.json'),
  ];
  for (const path of paths) {
    try {
      const cfg = JSON.parse(readFileSync(path, 'utf8'));
      const key = cfg?.mcpServers?.stitch?.headers?.['X-Goog-Api-Key'];
      if (key) return key;
    } catch {
      /* try next */
    }
  }
  throw new Error('STITCH_API_KEY not found in env or MCP config');
}

async function mcpCall(apiKey, method, params = {}) {
  const res = await fetch('https://stitch.googleapis.com/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  return JSON.parse(text);
}

async function callTool(apiKey, name, args) {
  const result = await mcpCall(apiKey, 'tools/call', { name, arguments: args });
  if (result.error) throw new Error(JSON.stringify(result.error));
  return result.result;
}

async function main() {
  const apiKey = loadApiKey();
  mkdirSync(OUT_DIR, { recursive: true });

  const project = await callTool(apiKey, 'get_project', { projectId: PROJECT_ID });
  writeFileSync(join(OUT_DIR, 'project.json'), JSON.stringify(project, null, 2));

  const screens = await callTool(apiKey, 'list_screens', { projectId: PROJECT_ID });
  writeFileSync(join(OUT_DIR, 'screens.json'), JSON.stringify(screens, null, 2));

  const screenList = JSON.parse(
    screens.content?.[0]?.text ?? '[]',
  ).screens ?? JSON.parse(screens.content?.[0]?.text ?? '{}').screens ?? [];

  const parsed =
    typeof screenList === 'string'
      ? JSON.parse(screenList)
      : Array.isArray(screenList)
        ? screenList
        : screens;

  const items = parsed.screens ?? parsed ?? [];
  console.log(`Found ${items.length} screen(s)`);

  for (const screen of items) {
    const screenId = screen.name?.split('/').pop() ?? screen.screenId ?? screen.id;
    if (!screenId) continue;

    const detail = await callTool(apiKey, 'get_screen', {
      projectId: PROJECT_ID,
      screenId,
    });
    writeFileSync(
      join(OUT_DIR, `screen-${screenId}.json`),
      JSON.stringify(detail, null, 2),
    );

    try {
      const code = await callTool(apiKey, 'get_screen_code', {
        projectId: PROJECT_ID,
        screenId,
      });
      const html =
        code.content?.find((c) => c.type === 'text')?.text ??
        code.content?.[0]?.text ??
        '';
      if (html) {
        writeFileSync(join(OUT_DIR, `screen-${screenId}.html`), html);
      }
    } catch (err) {
      console.warn(`get_screen_code failed for ${screenId}:`, err.message);
    }
  }

  console.log(`Exported to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
