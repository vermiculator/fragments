import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function copyDir(src, dest) {
  if (!existsSync(src)) return;
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

const maybeSources = [
  path.join(projectRoot, 'src', 'assets', 'md'),
  path.join(projectRoot, 'assets', 'md'),
];

const srcDir = maybeSources.find(p => existsSync(p));
if (!srcDir) {
  console.warn('[copyAssets] No source assets directory found in:', maybeSources);
  process.exit(0);
}

const destDir = path.join(projectRoot, 'public', 'assets', 'md');
copyDir(srcDir, destDir);