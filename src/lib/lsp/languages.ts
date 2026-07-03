const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  json: 'json',
  css: 'css',
  scss: 'scss',
  less: 'less',
  html: 'html',
  htm: 'html',
  md: 'markdown',
  sh: 'shell',
  bash: 'shell',
  sql: 'sql',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',
  env: 'properties',
  gitignore: 'plaintext',
  txt: 'plaintext',
};

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  css: 'CSS',
  scss: 'SCSS',
  less: 'LESS',
  html: 'HTML',
  markdown: 'Markdown',
  shell: 'Shell',
  sql: 'SQL',
  yaml: 'YAML',
  xml: 'XML',
  properties: 'Properties',
  plaintext: 'Plain Text',
};

export function getLanguageId(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_LANGUAGE_MAP[extension] ?? 'plaintext';
}

export function getLanguageLabel(filePath: string): string {
  const languageId = getLanguageId(filePath);
  return LANGUAGE_LABELS[languageId] ?? languageId;
}

export function isTypeScriptLanguage(languageId: string): boolean {
  return languageId === 'typescript' || languageId === 'javascript';
}
