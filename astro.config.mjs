// @ts-check
import { defineConfig, envField } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightObsidian from 'starlight-obsidian';
import starlightSiteGraph from 'starlight-site-graph';
import starlightScrollToTop from 'starlight-scroll-to-top';
import vercel from '@astrojs/vercel';
import { loadEnv } from "vite";
import obsidianImages from './src/scripts/remark/obsidianImages.js';
import react from '@astrojs/react';
import inject from '@rollup/plugin-inject';
import mdx from '@astrojs/mdx';
import renameMdToMdx from './src/scripts/renameMdToMdx.js';

const env = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_SITE_DOMAIN,
  output: 'server',
  adapter: vercel(),
  markdown: {
    remarkPlugins: [obsidianImages],
    // Allow MDX-style components in .md files
    gfm: true,
  },
  // Removed dynamic redirects, now handled by middleware
  redirects: {},
  vite: {
    plugins: [
        inject({
            p5: 'p5',
        }),
        renameMdToMdx(),
    ],
    optimizeDeps: {
	    include: []
	},
  },
  integrations: [
      starlight({
      title: 'index',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 6,
      },
      routeMiddleware: ['./src/scripts/middleware/routeData.ts'],
      customCss: [
        './src/styles/starlight-overrides.css'
      ],
      social: [
          { icon: 'open-book', label: 'Library', href: '/library/start-here' },
          { icon: 'puzzle', label: 'Mulch', href: '/mulch' },
          { icon: 'github', label: 'GitHub', href: 'https://github.com/vermiculator' },
          { icon: 'seti:html', label: 'Website', href: 'https://rowanlucas.github.io' },
      ],
     components: {
      Sidebar: './src/components/Sidebar.astro',
      PageSidebar: './src/components/PageSidebar.astro',
      PageFrame: './src/components/PageFrame.astro',
      },
      sidebar: [
          { label: 'thesis >', link: '/works/thesis/masters-thesis' },
          { label: 'earth >', link: '/earth' },
          { label: 'library >', link: '/library' },
          { label: 'entities >', link: '/entities' }
      ],
      plugins: [
          starlightScrollToTop({
          // Button position
          position: 'right',
          showTooltip: false,
          smoothScroll: true,
          // Visibility threshold (show after scrolling 20% down)
          threshold: 20,
          svgPath: 'M25 42 12 29 42 29Z',
          svgStrokeWidth: 1,
          borderRadius: '50',
        }),
          starlightObsidian({
            vault: './src/content/vault',
            ignore: ['./*.md', '*/*.jpg', '*/*.png', '*/*.webp', 'id.md','.filenignore','.megaignore','*.acsm','LICENSE','*.txt','*.pdf','desktop.ini','./Rubbish','_.debris','.trash','./seeds', './private', './assets', './themes', './are.na'],
            output: 'mdx',
            copyFrontmatter: 'all',
            tableOfContentsOverview: 'title'
          }),
          starlightSiteGraph({
              debug: false,
              trackVisitedPages: 'disable',
              sitemapConfig: {
                  includeExternalLinks: true,
                  ignoreStarlightLinks: true,
                  linkInclusionRules: ["!https://read.readwise.io/read/*", "**/*"],
              },
              backlinksConfig: {
                visibilityRules: ["**/*"],
              },
              graphConfig: {
                  "depth": 2,
                  "depthDirection": "both",
                  "actions": [
                      "fullscreen",
                      "depth"
                  ],
                  "repelForce": 333,
                  "colliderPadding": 18,
                  "alphaDecay": 0.023,
                  "enableDrag": true,
                  "enablePan": true,
                  "enableZoom": true,
                  "enableHover": true,
                  "enableClick": "click",
                  "prefetchPages": true,
                  "renderUnresolved": true,
                  "renderArrows": true,
                  "renderExternal": true,
                  "nodeDefaultStyle": {
                      "shape": "circle",
                      "shapeSize": 4,
                      "shapeColor": "backgroundColor",
                      "strokeColor": "nodeColor",
                      "strokeWidth": 2,
                      "cornerType": "bevel",
                      "neighborScale": 0.4,
                    },
                  "linkWidth": 2,
                  "linkHoverWidth": 3,
                  "visibilityRules": [
                      "**/*"
                    ],

              },
          }),
        ]
       // .concat(process.env.CHECK_LINKS ? starlightLinksValidator() : []),
    }), mdx({
      extendMarkdownConfig: true,
      optimize: true,
    }), react()],
     env: {
        schema: {
            SOLID_IDP: envField.string({ context: "client", access: "public", default: "https://solidcommunity.net" }),
            SOLID_USERNAME: envField.string({ context: "client", access: "public", default: "username" }),
            SOLID_PASSWORD: envField.string({ context: "server", access: "secret", default: "password" }),
            SOLID_VAULT_BASE_PATH: envField.string({ context: "client", access: "public", default: "/vault" }),
            LOCAL_VAULT_BASE_PATH: envField.string({ context: "client", access: "public", default: "/src/content/vault/" }),
            PUBLIC_SITE_DOMAIN:  envField.string({ context: "client", access: "public", default: "https://uncommonearthworm.vercel.app" })
        }
    }

});