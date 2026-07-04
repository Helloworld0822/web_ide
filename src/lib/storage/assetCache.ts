import { STORES, idbGet, idbSet } from './indexedDb';

export async function getCachedAsset(url: string): Promise<ArrayBuffer | null> {
  const entry = await idbGet<{ data: ArrayBuffer; savedAt: number }>(STORES.assets, url);
  return entry?.data ?? null;
}

export async function setCachedAsset(url: string, data: ArrayBuffer): Promise<void> {
  await idbSet(STORES.assets, url, { data, savedAt: Date.now() });
}

export async function fetchAssetWithCache(url: string): Promise<ArrayBuffer> {
  const cached = await getCachedAsset(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${url} (${response.status})`);
  }

  const data = await response.arrayBuffer();
  try {
    await setCachedAsset(url, data);
  } catch {
    // Ignore quota errors for large assets such as the Alpine ISO.
  }
  return data;
}

export function bufferToBlobUrl(data: ArrayBuffer, mimeType = 'application/octet-stream'): string {
  return URL.createObjectURL(new Blob([data], { type: mimeType }));
}

export async function resolveCachedUrl(
  url: string,
  mimeType = 'application/octet-stream',
): Promise<string> {
  const data = await fetchAssetWithCache(url);
  return bufferToBlobUrl(data, mimeType);
}

interface FsManifestEntry {
  size?: number;
  hash?: string;
  type?: string;
  contents?: Record<string, FsManifestEntry>;
}

function collectManifestHashes(
  node: FsManifestEntry,
  hashes: Set<string>,
): void {
  if (node.hash) hashes.add(node.hash);
  if (node.contents) {
    for (const child of Object.values(node.contents)) {
      collectManifestHashes(child, hashes);
    }
  }
}

export async function prefetchAlpineFilesystem(
  manifestUrl: string,
  baseUrl: string,
  onProgress?: (loaded: number, total: number) => void,
): Promise<void> {
  const manifestBuffer = await fetchAssetWithCache(manifestUrl);
  const manifest = JSON.parse(new TextDecoder().decode(manifestBuffer)) as
    | Record<string, FsManifestEntry>
    | { fsroot: FsManifestEntry };

  const hashes = new Set<string>();
  if ('fsroot' in manifest) {
    collectManifestHashes(manifest.fsroot, hashes);
  } else {
    for (const value of Object.values(manifest)) {
      collectManifestHashes(value, hashes);
      if (typeof value === 'object' && value && 'hash' in value && value.hash) {
        hashes.add(value.hash);
      }
    }
  }

  const entries = [...hashes];
  let loaded = 0;

  for (const hash of entries) {
    await fetchAssetWithCache(`${baseUrl}/${hash}`);
    loaded += 1;
    onProgress?.(loaded, entries.length);
  }
}
