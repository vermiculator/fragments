/**
 * Shared utilities for image path handling in copyAssets script
 * Used during build to transform image references in generated MDX files
 */

/**
 * Slugify an asset filename to use in public/assets/md paths
 * Normalizes the filename and returns a URL path
 */
export function slugifyAssetFilename(input) {
  if (!input) return input;
  const parts = input.replace(/\\/g, '/').split('/');
  const filename = parts.pop();
  const [name, ...extParts] = filename.split('.');
  const ext = extParts.length ? '.' + extParts.join('.') : '';
  const slug = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
  return `/assets/md/${slug}${ext}`;
}

/**
 * Fix image paths in markdown/mdx content
 * Converts relative paths to absolute /assets/md/ URLs
 */
export function fixImagePaths(content) {
  if (!content) return content;
  
  let fixed = content;
  
  // Pattern 1: ![...](../../../../assets/...) - relative paths from generated mdx
  fixed = fixed.replace(/!\[([^\]]*)\]\((?:\.\.+\/)+assets\/mdx?\/([^\)]+)\)/g, 
    (match, alt, file) => {
      const url = slugifyAssetFilename(file);
      return `![${alt}](${url})`;
    });
  
  // Pattern 2: ![...]('../assets/...') - quoted relative paths
  fixed = fixed.replace(/!\[([^\]]*)\]\('(?:\.\.+\/)*assets\/mdx?\/([^']+)'\)/g,
    (match, alt, file) => {
      const url = slugifyAssetFilename(file);
      return `![${alt}](${url})`;
    });
    
  // Pattern 3: ![...](../assets/...) - various depths of relative paths
  fixed = fixed.replace(/!\[([^\]]*)\]\((?:\.\.\/)*assets\/([^\)]+)\)/g,
    (match, alt, file) => {
      const url = slugifyAssetFilename(file);
      return `![${alt}](${url})`;
    });
  
  return fixed;
}
