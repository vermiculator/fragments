import { defineMiddleware } from 'astro:middleware';
import { getLinks } from '../src/scripts/getLinks';
import { debracketKeepFirst, slugify } from '../src/scripts/util';
import type { DataEntryMap } from 'astro:content';

export const onRequest = defineMiddleware(async (context, next) => {
    if (context?.params?.id) {
        const kinds: (keyof DataEntryMap)[] = ['earth', 'library', 'entities'];
        const allLinks = new Set<string>();

        for (const k of kinds) {
            const links = await getLinks('parents', k, context.params.id);
            if (links) {
                for (const link of links) {
                    const slug = slugify(debracketKeepFirst(link.id));
                    allLinks.add(`/${k}/${slug}/`);
                }
            }
        }

        // Always filter, showing empty groups if no parent links found
        context.locals.starlightRoute.sidebar = context.locals.starlightRoute.sidebar.map(entry => {
            if (entry.type === 'group') {
                const filteredEntries = allLinks.size > 0
                    ? entry.entries.filter(subEntry => {
                        if (subEntry.type === 'link') {
                            return allLinks.has(subEntry.href);
                        }
                        return true;
                    })
                    : []; // Empty array when no parent links
                return { ...entry, entries: filteredEntries };
            }
            return entry;
        });
    }

    return next();
});