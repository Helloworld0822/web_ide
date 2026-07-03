const PREFIX = 'web-ide:';

export const LOCAL_KEYS = {
  projectName: `${PREFIX}project-name`,
  workspaceMeta: `${PREFIX}workspace-meta`,
  vmCacheReady: `${PREFIX}vm-cache-ready`,
} as const;

export function readLocalJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeLocalJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readLocalString(key: string): string | null {
  return localStorage.getItem(key);
}

export function writeLocalString(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function removeLocal(key: string): void {
  localStorage.removeItem(key);
}
