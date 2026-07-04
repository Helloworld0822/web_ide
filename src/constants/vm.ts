export const VM_ASSET_PATHS = {
  wasm: 'v86/v86.wasm',
  seabios: 'v86/bios/seabios.bin',
  vgabios: 'v86/bios/vgabios.bin',
  alpineIso: 'vm/alpine-virt.iso',
} as const;

export const ALPINE_ISO = {
  async: true as const,
  size: 47_185_920,
} as const;

export const ALPINE_VM_CONFIG = {
  memorySize: 256 * 1024 * 1024,
  vgaMemorySize: 8 * 1024 * 1024,
  cmdline: 'console=hvc0',
} as const;

export const VM_NETWORK_CONFIG = {
  type: 'virtio' as const,
  relay_url: 'fetch',
  dns_method: 'doh' as const,
  doh_server: 'cloudflare-dns.com',
} as const;
