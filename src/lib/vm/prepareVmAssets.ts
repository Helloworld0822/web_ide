import { VM_ASSET_PATHS } from '../../constants/vm';
import { fetchAssetWithCache } from '../storage/assetCache';
import { LOCAL_KEYS, writeLocalJson } from '../storage/localStore';

export interface VmAssetUrls {
  wasmPath: string;
  biosUrl: string;
  vgaBiosUrl: string;
  cdromUrl: string;
}

function publicAssetUrl(relativePath: string): string {
  return new URL(`${import.meta.env.BASE_URL}${relativePath}`, window.location.href).href;
}

export function getVmAssetUrls(): VmAssetUrls {
  return {
    wasmPath: publicAssetUrl(VM_ASSET_PATHS.wasm),
    biosUrl: publicAssetUrl(VM_ASSET_PATHS.seabios),
    vgaBiosUrl: publicAssetUrl(VM_ASSET_PATHS.vgabios),
    cdromUrl: publicAssetUrl(VM_ASSET_PATHS.alpineIso),
  };
}

async function warmSmallAssetCache(urls: VmAssetUrls): Promise<void> {
  await Promise.all([
    fetchAssetWithCache(urls.wasmPath),
    fetchAssetWithCache(urls.biosUrl),
    fetchAssetWithCache(urls.vgaBiosUrl),
  ]);
}

export async function prepareVmAssets(
  onStatus?: (message: string) => void,
): Promise<VmAssetUrls> {
  const urls = getVmAssetUrls();

  onStatus?.('Caching small VM libraries in the background...');
  try {
    await warmSmallAssetCache(urls);
    writeLocalJson(LOCAL_KEYS.vmCacheReady, {
      ready: true,
      cachedAt: Date.now(),
    });
  } catch {
    // Cache warm-up is optional; v86 loads assets directly from same-origin URLs.
  }

  onStatus?.('Booting Alpine VM (ISO streams from site, first boot may take a minute)...');
  return urls;
}

export function releaseVmAssetUrls(urls: VmAssetUrls): void {
  for (const url of [urls.wasmPath, urls.biosUrl, urls.vgaBiosUrl, urls.cdromUrl]) {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}
