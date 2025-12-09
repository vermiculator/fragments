import { defineCollection, reference, z} from 'astro:content';
import { glob } from 'astro/loaders';
import { i18nSchema } from '@astrojs/starlight/schema';
import { i18nLoader } from '@astrojs/starlight/loaders';
//import { inruptSolidPodLoader } from '../src/loaders/solid';
import { pageSiteGraphSchema } from 'starlight-site-graph/schema';

const anyDoc = z.union([reference('structural'), reference('thesis'), reference('metaThesis'), reference('earth'), reference('library'), reference('entities')]);

const baseSchema = {
	title: z.string(),
	parent: z.array(anyDoc).optional(),
	peer: z.array(anyDoc).optional(),
	child: z.array(anyDoc).optional(),
	instanceOf: z.array(anyDoc).optional(),
	instances: z.array(anyDoc).optional(),
	caveats: z.array(anyDoc).optional(),
	backwards: z.string().optional(),
	forwards: z.string().optional(),
	aliases: z.array(z.string()).nullable().optional(),
};

export const collections = {
	earth: defineCollection({
		loader: glob({ 
			pattern: ['**/*.md', '**/*.mdx'], 
			base: "./src/content/docs/mdx/earth",
			generateId: ({ entry, base }) => {
				// entry is the relative path from base, e.g., "'apolitical' masses.md"
				// Remove extension and slugify
				const pathWithoutExt = entry.replace(/\.(md|mdx)$/, '');
				// Remove any directory parts (in case of subdirectories)
				const filename = pathWithoutExt.split('/').pop() || pathWithoutExt;
				const slug = filename.toLowerCase()
					.replace(/[^\w\s-]/g, '')
					.replace(/\s+/g, '-')
					.replace(/-+/g, '-')
					.trim();
				console.log(`[generateId earth] ${entry} -> ${slug}`);
				return slug;
			}
		}),
		schema: z.object(baseSchema).merge(pageSiteGraphSchema),
	}),
	entities: defineCollection({
		loader: glob({ 
			pattern: ['**/*.md', '**/*.mdx'], 
			base: "./src/content/docs/mdx/entities",
			generateId: ({ entry, base }) => {
				const pathWithoutExt = entry.replace(/\.(md|mdx)$/, '');
				const filename = pathWithoutExt.split('/').pop() || pathWithoutExt;
				return filename.toLowerCase()
					.replace(/[^\w\s-]/g, '')
					.replace(/\s+/g, '-')
					.replace(/-+/g, '-')
					.trim();
			}
		}),
		schema: z.object({
			...baseSchema,
			author: z.array(z.string()).optional(),
		}).merge(pageSiteGraphSchema),
	}),
	library: defineCollection({
		loader: glob({ 
			pattern: ['**/*.md', '**/*.mdx'], 
			base: "./src/content/docs/mdx/library",
			generateId: ({ entry, base }) => {
				const pathWithoutExt = entry.replace(/\.(md|mdx)$/, '');
				const filename = pathWithoutExt.split('/').pop() || pathWithoutExt;
				return filename.toLowerCase()
					.replace(/[^\w\s-]/g, '')
					.replace(/\s+/g, '-')
					.replace(/-+/g, '-')
					.trim();
			}
		}),
		schema: z.object({
			...baseSchema,
			status: z.enum(['DORMANT', 'CURRENTLY', 'ARCHIVED']).optional(),
			url: z.string().optional(),
			published_date: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
			author: z.array(z.string()).optional(),
		}).merge(pageSiteGraphSchema),
	}),
	thesis: defineCollection({
		loader: glob({ pattern: ['*.md', '*.mdx'], base: "./src/content/vault/works/thesis" }),
		schema: z.object(baseSchema).merge(pageSiteGraphSchema),
	}),
	metaThesis: defineCollection({
		loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: "./src/content/vault/works/thesis/meta-thesis" }),
		schema: z.object(baseSchema).merge(pageSiteGraphSchema),
	}),
	structural: defineCollection({
		loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: "./src/content/vault/plain/structural" }),
		schema: z.object(baseSchema).merge(pageSiteGraphSchema),
	}),
	vignettes: defineCollection({
		loader: glob({ pattern: ['**/*.md'], base: "./src/data/vignettes" }),
		schema: z.object({
			hide: z.boolean().optional(),
			appearOn:z.array(z.string()).optional(),
			format: z.enum(['image', 'text']),
			kind: z.enum(['body', 'photo', 'portrait', 'person', 'nature', 'illu', 'creature', 'writing', 'poem', 'painting', 'sketch', 'misc']),
			url: z.string().optional(),
			alt: z.string().optional(),
			title: z.string().optional(),
			caption: z.string().optional(),
			date: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
		}),
	}),
	mulch: defineCollection({
		loader: glob({ pattern: ['**/*.md'], base: "./src/data/mulch" }),
		schema: z.object({
			type: z.string(),
			kind: z.enum(['col', 'mono']),
			url: z.string(),
			alt: z.string().optional(),
			title: z.string().optional(),
			caption: z.string().optional(),
			date: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
		}),
	}),
/* 	works: defineCollection({
		loader: glob({ pattern: [' * * /*.md'], base: "./src/data/works" }),
		schema: z.object({
			format: z.enum(['image', 'video']),
			kind: z.enum(['col', 'mono']),
			url: z.string(),
			alt: z.string().optional(),
			title: z.string().optional(),
			caption: z.string().optional(),
			date: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
		}),
	}),
*/


	////////////////// TYPES ///////////////////////

	mediaTypes: defineCollection({
		loader: glob({ pattern: ['library-kinds.json'], base: "./src/data" }),
		schema: z.array(
			z.object({
				title: z.string(),
			})
		),
	}),

	bookmarks: defineCollection({
		loader: glob({ pattern: ['bookmark-kinds.json'], base: "./src/data" }),
		schema: z.array(
			z.object({
				src: z.string(),
				title: z.string()
			})
		),
	}),

	////////////////// MISC ///////////////////////

	pinnedItems: defineCollection({
		loader: glob({ pattern: ['pinned-items.json'], base: "./src/data" }),
		schema: z.array(
			z.object({
				slug: z.string(),
			})
		),
	}),

	////////////////////////////////////////////

	// Starlight i18n collection for UI translations
	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema(),
	}),

};
