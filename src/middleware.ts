import { defineMiddleware } from 'astro:middleware';

const PLAIN_COLLECTIONS = ['thesis', 'about', 'meta-thesis', 'structural'];
const UNIQUE_COLLECTIONS = ['entities', 'earth', 'library'];

function maybeRedirect(pathname: string): string | undefined {

    // special cases
    if(pathname === '/'){
        return '/';
    }
    if (pathname === '/thesis' || pathname === '/thesis/') {
        return '/plain/thesis/masters-thesis';
    }
    if (pathname === '/about' || pathname === '/about/') {
        return '/plain/about/about';
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

    for (const collection of PLAIN_COLLECTIONS) {
        if (pathname.startsWith(`/plain/${collection}/`)) {
            return undefined; // Already correct path
        }
        if (pathname.startsWith(`/${collection}/`)) {
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
