import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Custom Astro content loader for markdown files with slug transformation
 * Reads from vault and applies slugification to filenames
 */
export function createMdxLoader(relativeBasePath) {
  return async function load() {
    const entries = [];
    // Resolve relative to project root
    const baseDir = resolve(process.cwd(), relativeBasePath);
    
    async function walkDir(dir) {
      try {
        const items = await readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = join(dir, item.name);
          
          if (item.isDirectory()) {
            await walkDir(fullPath);
          } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
            try {
              const fileContent = await readFile(fullPath, 'utf-8');
              const { data, content: body } = matter(fileContent);
              
              // Get filename without extension
              const filename = item.name.replace(/\.(md|mdx)$/, '');
              const slug = slugifyFilename(filename);
              
              // Ensure all required fields
              const entryData = {
                ...data,
              };
              
              // Ensure title exists
              if (!entryData.title) {
                entryData.title = filename;
              }
              
              entries.push({
                id: slug,
                data: entryData,
                body: body,
              });
            } catch (err) {
              // Log error but continue - skip malformed files
              console.warn(`[customMdxLoader] Skipping ${item.name} due to parse error: ${err.message}`);
            }
          }
        }
      } catch (err) {
        console.error(`[customMdxLoader] Error reading directory ${dir}:`, err.message);
      }
    }
    
    await walkDir(baseDir);
    return entries;
  };
}

function slugifyFilename(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // Remove special characters
    .replace(/[\s_-]+/g, '-')    // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
}

export { slugifyFilename };
