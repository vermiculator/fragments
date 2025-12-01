import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join } from 'path';

function copyDir(src, dest) {
  if (!existsSync(src)) return;
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

const srcDir = join(__dirname, '..', 'src', 'assets', 'md');
const destDir = join(__dirname, '..', 'public', 'assets', 'md');
copyDir(srcDir, destDir);