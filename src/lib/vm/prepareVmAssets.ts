import { VM_ASSET_PATHS } from '../../constants/vm';
import {
  bufferToBlobUrl,
  fetchAssetWithCache,
} from '../storage/assetCache';
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

export async function prepareVmAssets(
  onStatus?: (message: string) => void,
): Promise<VmAssetUrls> {
  onStatus?.('Loading VM libraries...');

  const wasmData = await fetchAssetWithCache(publicAssetUrl(VM_ASSET_PATHS.wasm));
  const wasmPath = bufferToBlobUrl(wasmData, 'application/wasm');

  onStatus?.('Loading BIOS images...');
  const [biosUrl, vgaBiosUrl] = await Promise.all([
    fetchAssetWithCache(publicAssetUrl(VM_ASSET_PATHS.seabios)).then((data) =>
      bufferToBlobUrl(data, 'application/octet-stream'),
    ),
    fetchAssetWithCache(publicAssetUrl(VM_ASSET_PATHS.vgabios)).then((data) =>
      bufferToBlobUrl(data, 'application/octet-stream'),
    ),
  ]);

  onStatus?.('Loading Alpine ISO (first run may take a while)...');
  const isoData = await fetchAssetWithCache(publicAssetUrl(VM_ASSET_PATHS.alpineIso));
  const cdromUrl = bufferToBlobUrl(isoData, 'application/x-iso9660-image');

  writeLocalJson(LOCAL_KEYS.vmCacheReady, {
    ready: true,
    cachedAt: Date.now(),
    isoBytes: isoData.byteLength,
  });

  onStatus?.('VM libraries ready');

  return {
    wasmPath,
    biosUrl,
    vgaBiosUrl,
    cdromUrl,
  };
}

export function releaseVmAssetUrls(urls: VmAssetUrls): void {
  URL.revokeObjectURL(urls.wasmPath);
  URL.revokeObjectURL(urls.biosUrl);
  URL.revokeObjectURL(urls.vgaBiosUrl);
  URL.revokeObjectURL(urls.cdromUrl);
}
