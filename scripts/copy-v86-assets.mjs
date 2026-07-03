import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public', 'v86');
const wasmSource = join(root, 'node_modules', 'v86', 'build', 'v86.wasm');

mkdirSync(publicDir, { recursive: true });
cpSync(wasmSource, join(publicDir, 'v86.wasm'), { force: true });

console.log('Copied v86.wasm to public/v86/');
