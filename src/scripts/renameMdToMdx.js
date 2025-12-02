import fs from 'fs';
import path from 'path';

export default function renameMdToMdx() {
  let watcher;

  return {
    name: 'vite-plugin-rename-md-to-mdx',
    configureServer(server) {
      const mdxDir = path.resolve(process.cwd(), 'src/content/docs/mdx');

      // Initial rename on server start
      setTimeout(() => {
        renameAllMdFiles(mdxDir);
      }, 3000);

      // Watch for new .md files and rename them
      if (fs.existsSync(mdxDir)) {
        watcher = fs.watch(mdxDir, { recursive: true }, (eventType, filename) => {
          if (filename && filename.endsWith('.md')) {
            const fullPath = path.join(mdxDir, filename);
            if (fs.existsSync(fullPath)) {
              const newPath = fullPath.replace(/\.md$/, '.mdx');
              try {
                fs.renameSync(fullPath, newPath);
                server.ws.send({
                  type: 'full-reload',
                  path: '*'
                });
              } catch (err) {
                // File might already be renamed
              }
            }
          }
        });
      }
    },
    buildEnd() {
      if (watcher) {
        watcher.close();
      }
    }
  };
}

function renameAllMdFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      renameAllMdFiles(fullPath);
    } else if (entry.name.endsWith('.md')) {
      const newPath = fullPath.replace(/\.md$/, '.mdx');
      try {
        fs.renameSync(fullPath, newPath);
        console.log(`[rename-md-to-mdx] ${entry.name} -> ${entry.name.replace('.md', '.mdx')}`);
      } catch (err) {
        // File might already be renamed
      }
    }
  }
}
