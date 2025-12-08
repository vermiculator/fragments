import { defineMiddleware } from 'astro:middleware';

const PLAIN_COLLECTIONS = ['thesis', 'about', 'meta-thesis', 'structural'];
const UNIQUE_COLLECTIONS = ['entities', 'earth', 'library'];

function maybeRedirect(pathname: string): string | undefined {

    // Temp fix: strip leading [[ from malformed wikilink paths
    if (pathname.includes('%5B%5B') || pathname.startsWith('/[[')) {
        pathname = pathname.replace(/%5B%5B/g, '').replace(/^\/%5B%5B/, '/').replace(/^\/\[\[/, '/');
    }

    // special cases
    if(pathname === '/'){
        return '/';
    }
    if (pathname === '/thesis' || pathname === '/thesis/') {
        return '/works/thesis/masters-thesis';
    }
    if (pathname === '/about' || pathname === '/about/' || pathname === '/plain/about' || pathname === '/plain/about/' ) {
        return '/plain/about/about';
    }
    if (pathname === '/earth/masters-thesis' || pathname === '/earth/masters-thesis/') {
        return '/works/thesis/masters-thesis';
    }

    // normalize plain routes first
    for (const prefix of ['/mdx/', '/mdx', '/md/', '/md']) {
        if (pathname.startsWith(prefix)) {
            const rest = pathname.slice(prefix.length);
            const nextSeg = rest.split('/')[0] ?? '';
            if (PLAIN_COLLECTIONS.includes(nextSeg)) {
                return `/plain/${rest}`;
            }
            return `/${rest}`;
        }
    }

    // Handle /earth/thesis/ → /works/thesis/
    if (pathname.startsWith('/earth/thesis/')) {
        const rest = pathname.slice('/earth/thesis/'.length);
        return `/works/thesis/${rest}`;
    }

    // Handle /thesis/ → /works/thesis/
    if (pathname.startsWith('/thesis/')) {
        const rest = pathname.slice('/thesis/'.length);
        return `/works/thesis/${rest}`;
    }

    for (const collection of PLAIN_COLLECTIONS) {
        if (pathname.startsWith(`/plain/${collection}/`)) {
            return undefined; // Already correct path
        }
        if (pathname.startsWith(`/${collection}/`) && collection !== 'thesis') {
            const rest = pathname.slice(`/${collection}/`.length);
            return `/plain/${collection}/${rest}`;
        }
    }

    for (const collection of UNIQUE_COLLECTIONS) {
        if (pathname.startsWith(`/${collection}/${collection}/`)) {
            const rest = pathname.slice(`/${collection}/`.length);
            return `${rest}`;
        }
    }

    return pathname;

}

export const onRequest = defineMiddleware((context, next) => {
    const redirectTo = maybeRedirect(context.url.pathname);
    if (redirectTo && redirectTo !== context.url.pathname) {
        return context.redirect(redirectTo, 301);
    }
    return next();
});
