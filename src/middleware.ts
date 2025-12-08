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

    // Static special-case redirects
    if (pathname === '/thesis' || pathname === '/thesis/') {
        return '/works/thesis/masters-thesis';
    }
    if (pathname === '/earth/thesis' || pathname === '/earth/thesis/') {
        return '/works/thesis/';
    }
    if (pathname === '/about' || pathname === '/about/' || pathname === '/plain/about' || pathname === '/plain/about/') {
        return '/plain/about/about';
    }
    if (pathname === '/earth/masters-thesis' || pathname === '/earth/masters-thesis/') {
        return '/works/thesis/masters-thesis';
    }

    // Handle /mdx/* and /md/* prefixes - strip them and redirect
    for (const prefix of ['/mdx/', '/mdx', '/md/', '/md']) {
        if (pathname.startsWith(prefix)) {
            let rest = pathname.slice(prefix.length);
            // Clean up any leading slash left after stripping prefix
            while (rest.startsWith('/')) {
                rest = rest.slice(1);
            }
            // If nothing left, redirect to root
            if (!rest) {
                return '/';
            }
            // Check if first segment is a plain collection
            const nextSeg = rest.split('/')[0] ?? '';
            if (PLAIN_COLLECTIONS.includes(nextSeg)) {
                return `/plain/${rest}`;
            }
            // Default: strip the prefix and redirect
            return `/${rest}`;
        }
    }

    // Redirect collection routes to /plain/ if needed
    for (const collection of PLAIN_COLLECTIONS) {
        if (collection === 'thesis') continue; // thesis is handled above
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
