import { cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');

// Package the browser source tree, keeping development files out of the APK.
await rm(output, { recursive: true, force: true });
await cp(path.join(root, 'src'), output, { recursive: true });
console.log('Packaged src/ into dist/.');
