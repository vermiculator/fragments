import { defineCollection, reference, z} from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { i18nLoader } from '@astrojs/starlight/loaders';
//import { inruptSolidPodLoader } from '../src/loaders/solid';
import { pageSiteGraphSchema } from 'starlight-site-graph/schema';

const anyDoc = z.union([reference('structural'), reference('docs'), reference('about'), reference('thesis'), reference('metaThesis'), reference('earth'), reference('library'), reference('entities')]);

const generalSchema = docsSchema({
	    extend: z.object({
		  parent:  z.array(anyDoc).optional(),
		  peer:  z.array(anyDoc).optional(),
		  child:  z.array(anyDoc).optional(),
		  instanceOf:  z.array(anyDoc).optional(),
		  instances: z.array(anyDoc).optional(),
		  caveats: z.array(anyDoc).optional(),
		  backwards: z.string().optional(),
		  forwards: z.string().optional(),
		  aliases: z.array(z.string()).nullable().optional(),
		}).merge(pageSiteGraphSchema),
	  });

export const collections = {
	earth: defineCollection({
			loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: "./src/content/docs/mdx/earth" }),
		  schema: generalSchema
	}),
	entities: defineCollection({
			loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: "./src/content/docs/mdx/entities" }),
			schema: docsSchema({
			extend: z.object({
			  author: z.array(z.string()).optional(),
			  caveats: z.array(z.string()).optional(),
			  peer: z.array(anyDoc).optional(),
			}).merge(pageSiteGraphSchema),
		}),
	}),
	library: defineCollection({
			loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: "./src/content/docs/mdx/library" }),
			schema: docsSchema({
			extend: z.object({
			  status: z.enum(['DORMANT', 'CURRENTLY', 'ARCHIVED']).optional(),
			  url: z.string().optional(),
			  published_date: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
			  author: z.array(z.string()).optional(),
			  caveats: z.array(z.string()).optional(),
			  peer: z.array(anyDoc).optional(),
			}).merge(pageSiteGraphSchema),
		  }),
	}),
	about: defineCollection({
		loader: glob({ pattern: ['*.md', '*.mdx'], base: "./src/content/docs/mdx/plain/about/" }),
		 schema: generalSchema
	}),
	thesis: defineCollection({
		loader: glob({ pattern: ['*.md', '*.mdx'], base: "./src/content/docs/mdx/plain/thesis" }),
		  schema: generalSchema
	}),
	metaThesis: defineCollection({
		loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: "./src/content/docs/mdx/plain/meta-thesis" }),
		  schema: generalSchema
	}),
	structural: defineCollection({
		loader: glob({ pattern: ['**/*.md', '**/*.mdx'], base: "./src/content/docs/mdx/plain/structural" }),
		  schema: generalSchema
	}),
	docs: defineCollection({
		loader: glob({ 
			pattern: ['**/*.mdx', '**/*.md', '!earth/**', '!library/**', '!entities/**', '!plain/thesis/**', '!plain/meta-thesis/**', '!plain/about/**'], 
			base: "./src/content/docs/mdx"
		}),
		  schema: generalSchema
	}),


	////////////////// DATA ///////////////////////

	/* solidcontent: defineCollection({
		loader: inruptSolidPodLoader,
		schema: z.object({
			id: z.string().optional(),
			title: z.string().optional(),
		}),
	}), */

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
	works: defineCollection({
		loader: glob({ pattern: ['**/*.md'], base: "./src/data/works" }),
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
