export const V86_CDN = 'https://copy.sh/v86';

export const ALPINE_ISO = {
  url: 'https://dl-cdn.alpinelinux.org/alpine/v3.18/releases/x86/alpine-virt-3.18.5-x86.iso',
  async: true as const,
  size: 47_185_920,
};

export const ALPINE_VM_CONFIG = {
  wasmPath: '/v86/v86.wasm',
  memorySize: 512 * 1024 * 1024,
  vgaMemorySize: 8 * 1024 * 1024,
  cmdline: 'console=hvc0',
  bios: {
    url: `${V86_CDN}/bios/seabios.bin`,
  },
  vgaBios: {
    url: `${V86_CDN}/bios/vgabios.bin`,
  },
} as const;

export const VM_NETWORK_CONFIG = {
  type: 'virtio' as const,
  relay_url: 'fetch',
  dns_method: 'doh' as const,
  doh_server: 'cloudflare-dns.com',
};

export const CACHEABLE_URL_PREFIXES = [
  V86_CDN,
  'https://dl-cdn.alpinelinux.org/',
] as const;
