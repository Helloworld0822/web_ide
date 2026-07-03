import { ALPINE_ISO, ALPINE_VM_CONFIG } from '../../constants/vm';
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

export async function prepareVmAssets(
  onStatus?: (message: string) => void,
): Promise<VmAssetUrls> {
  onStatus?.('Loading cached VM libraries...');

  const wasmUrl = new URL(`${import.meta.env.BASE_URL}v86/v86.wasm`, window.location.href).href;
  const wasmData = await fetchAssetWithCache(wasmUrl);
  const wasmPath = bufferToBlobUrl(wasmData, 'application/wasm');

  onStatus?.('Caching BIOS images locally...');
  const [biosUrl, vgaBiosUrl] = await Promise.all([
    fetchAssetWithCache(ALPINE_VM_CONFIG.bios.url).then((data) =>
      bufferToBlobUrl(data, 'application/octet-stream'),
    ),
    fetchAssetWithCache(ALPINE_VM_CONFIG.vgaBios.url).then((data) =>
      bufferToBlobUrl(data, 'application/octet-stream'),
    ),
  ]);

  onStatus?.('Caching Alpine ISO locally (first run may take a while)...');
  const isoData = await fetchAssetWithCache(ALPINE_ISO.url);
  const cdromUrl = bufferToBlobUrl(isoData, 'application/x-iso9660-image');

  writeLocalJson(LOCAL_KEYS.vmCacheReady, {
    ready: true,
    cachedAt: Date.now(),
    isoBytes: isoData.byteLength,
  });

  onStatus?.('VM libraries cached locally');

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
