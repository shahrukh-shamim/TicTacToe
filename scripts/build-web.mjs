import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');

// Package only browser assets, keeping development files out of the APK.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isFile() && /\.(html|css|js)$/.test(entry.name)) {
    await cp(path.join(root, entry.name), path.join(output, entry.name));
  }
}
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log('Packaged web pages, styles, scripts, workers, and assets into dist/.');
