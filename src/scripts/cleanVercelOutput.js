import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const outDir = path.join(projectRoot, '.vercel', 'output');

try {
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
    console.log(`[cleanVercelOutput] Removed ${outDir}`);
  } else {
    console.log(`[cleanVercelOutput] No output dir to remove at ${outDir}`);
  }
} catch (err) {
  console.warn('[cleanVercelOutput] Failed to remove output dir:', err?.message);
}
