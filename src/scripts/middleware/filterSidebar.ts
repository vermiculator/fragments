import { defineMiddleware } from 'astro:middleware';
import { getLinks } from '../getLinks';
import { debracketKeepFirst, slugify } from '../util';

export const onRequest = defineMiddleware(async (context, next) => {

    if(context && context.params && context.params.id){
        let links =  await getLinks("parents", "earth", context.params.id);
        if(links) {
            context.locals.starlightRoute.sidebar = context.locals.starlightRoute.sidebar.map(
                (entry) => {
                if( entry.type == 'group' ){
                    let filteredEntries = entry.entries.filter(
                        (subEntry) => {
                            if( subEntry.type == 'link' ){
                                let thisLink = subEntry.href;
                                return (links.some(
                                (eachLink) => {
                                    let entryentryLink = slugify(debracketKeepFirst(eachLink.id));
                                    return ('/earth/' + entryentryLink + '/') === thisLink;
                                } ));
                            } else {
                                return true;
                            }
                        }
                    )
                return { ...entry, entries: filteredEntries };

                } else {
                    return entry;
                }
            }

        );
    }}
    return next();
});