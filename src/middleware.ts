import { defineMiddleware } from 'astro:middleware';

const PLAIN_COLLECTIONS = ['thesis', 'about', 'meta-thesis', 'structural'];
const UNIQUE_COLLECTIONS = ['entities', 'earth', 'library'];

function maybeRedirect(pathname: string): string | undefined {

    // Normalize the input path: decode, collapse backslashes, trim duplicate slashes
    pathname = decodeURI(pathname).replace(/\\/g, '/').replace(/\/+/g, '/');

    // Temp fix: strip leading [[ from malformed wikilink paths
    if (pathname.includes('%5B%5B') || pathname.startsWith('/[[')) {
        pathname = pathname.replace(/%5B%5B/g, '').replace(/^\/%5B%5B/, '/').replace(/^\/\[\[/, '/');
    }

    // Static redirects (/thesis, /earth/thesis, /about, /earth/masters-thesis) and
    // dynamic prefix stripping (/mdx/*, /md/*) are handled by vercel.json

    // Redirect collection routes to /plain/ if needed
    for (const collection of PLAIN_COLLECTIONS) {
        if (collection === 'thesis') continue; // thesis is already handled by vercel.json
        if (pathname.startsWith(`/plain/${collection}/`)) {
            return undefined; // Already correct
        }
        if (pathname.startsWith(`/${collection}/`)) {
            const rest = pathname.slice(`/${collection}/`.length);
            return `/plain/${collection}/${rest}`;
        }
    }

    // Handle duplicate collection segments
    for (const collection of UNIQUE_COLLECTIONS) {
        if (pathname.startsWith(`/${collection}/${collection}/`)) {
            const rest = pathname.slice(`/${collection}/`.length);
            return `/${rest}`;
        }
    }

    return undefined;

}

export const onRequest = defineMiddleware((context, next) => {
    const redirectTo = maybeRedirect(context.url.pathname);
    if (redirectTo) {
        return context.redirect(redirectTo, 301);
    }
    return next();
});
