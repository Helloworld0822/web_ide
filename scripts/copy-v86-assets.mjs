import { cpSync, createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const ASSETS = [
  {
    label: 'v86.wasm',
    dest: join(root, 'public', 'v86', 'v86.wasm'),
    copyFrom: join(root, 'node_modules', 'v86', 'build', 'v86.wasm'),
  },
  {
    label: 'seabios.bin',
    dest: join(root, 'public', 'v86', 'bios', 'seabios.bin'),
    url: 'https://cdn.jsdelivr.net/gh/copy/v86@master/bios/seabios.bin',
  },
  {
    label: 'vgabios.bin',
    dest: join(root, 'public', 'v86', 'bios', 'vgabios.bin'),
    url: 'https://cdn.jsdelivr.net/gh/copy/v86@master/bios/vgabios.bin',
  },
  {
    label: 'alpine-virt.iso',
    dest: join(root, 'public', 'vm', 'alpine-virt.iso'),
    url: 'https://dl-cdn.alpinelinux.org/alpine/v3.18/releases/x86/alpine-virt-3.18.5-x86.iso',
  },
];

async function downloadToFile(url, dest) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }

  mkdirSync(dirname(dest), { recursive: true });

  if (!response.body) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(dest, Buffer.from(await response.arrayBuffer()));
    return;
  }

  await pipeline(Readable.fromWeb(response.body), createWriteStream(dest));
}

async function ensureAsset({ label, dest, copyFrom, url }) {
  if (existsSync(dest)) {
    const { size } = statSync(dest);
    console.log(`Skipping ${label} (${(size / 1024 / 1024).toFixed(1)} MB already present)`);
    return;
  }

  if (copyFrom) {
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(copyFrom, dest, { force: true });
    console.log(`Copied ${label} to ${dest.replace(root, '.')}`);
    return;
  }

  console.log(`Downloading ${label}...`);
  await downloadToFile(url, dest);
  const { size } = statSync(dest);
  console.log(`Downloaded ${label} (${(size / 1024 / 1024).toFixed(1)} MB)`);
}

for (const asset of ASSETS) {
  await ensureAsset(asset);
}
