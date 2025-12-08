import { visit } from 'unist-util-visit';

function slugifyFilename(input) {
  if (!input) return input;
  // Separate optional subpath and filename
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

function normalizeAssetUrl(url) {
  if (!url) return url;
  // Normalize slashes for consistent matching
  const normalized = url.replace(/\\/g, '/');
  // Strip any ../../.. leading segments before assets/md
  const cleaned = normalized.replace(/^(?:\.\.\/*)+/, '');
  const m = cleaned.match(/assets\/(mdx?)\/(.*)$/);
  if (m) return `/assets/md/${m[2]}`;
  // If someone referenced just a filename under assets
  if (/^(?:assets\/(mdx?)\/)/.test(cleaned)) return '/' + cleaned.replace('assets/mdx/', 'assets/md/');
  return normalized;
}

export default function obsidianImagesPlugin() {
  return (tree) => {
    // 1) Rewrite standard markdown image urls with deep relatives
    visit(tree, 'image', (node) => {
      if (typeof node.url === 'string') {
        const n = normalizeAssetUrl(node.url);
        node.url = n;
      }
    });

    // 2) Rewrite text nodes containing Obsidian embeds ![[...]] (with optional alt via pipe)
    visit(tree, 'text', (node) => {
      if (typeof node.value !== 'string') return;
      let v = node.value;
      // alias form: ![[file.ext|Alt text]]
      v = v.replace(/!\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_m, file, alt) => {
        const url = slugifyFilename(file.trim());
        return `![${alt.trim()}](${url})`;
      });
      // simple form: ![[file.ext]]
      v = v.replace(/!\[\[([^\]]+)\]\]/g, (_m, file) => {
        const url = slugifyFilename(file.trim());
        return `![](${url})`;
      });
      // Also fix markdown images that used deep ../../ paths into assets
      v = v.replace(/!\[([^\]]*)\]\((?:\.\.+\/)+assets\/(mdx?)\/([^\)]+)\)/g, (_m, alt, _kind, rest) => {
        return `![${alt}](/assets/md/${rest})`;
      });
      if (v !== node.value) node.value = v;
    });
  };
}
