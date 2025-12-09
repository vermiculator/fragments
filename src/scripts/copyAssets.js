import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixImagePaths } from '../loaders/imageUtils.js';

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

function processDirectory(dir) {
  if (!existsSync(dir)) return;
  
  const walkDir = (currentPath) => {
    const entries = readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          const fixed = fixImagePaths(content);
          
          if (content !== fixed) {
            writeFileSync(fullPath, fixed, 'utf-8');
            console.log(`[fixImagePaths] Fixed: ${fullPath}`);
          }
        } catch (err) {
          console.error(`[fixImagePaths] Error processing ${fullPath}: ${err.message}`);
        }
      }
    }
  };
  
  walkDir(dir);
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

// Fix image paths in generated MDX files
const mdxDir = path.join(projectRoot, 'src', 'content', 'docs', 'mdx');
processDirectory(mdxDir);