import { defineMiddleware } from 'astro:middleware';

const COLLECTIONS = ['entities', 'earth', 'library','thesis', 'about', 'meta-thesis', 'structural'];

function maybeRedirect(pathname: string): string | undefined {

    // Normalize the input path: decode, collapse backslashes, trim duplicate slashes
    pathname = decodeURI(pathname).replace(/\\/g, '/').replace(/\/+/g, '/');

    // Temp fix: strip leading [[ from malformed wikilink paths
    if (pathname.includes('%5B%5B') || pathname.startsWith('/[[')) {
        pathname = pathname.replace(/%5B%5B/g, '').replace(/^\/%5B%5B/, '/').replace(/^\/\[\[/, '/');
    }

    // Handle duplicate collection segments
    for (const collection of COLLECTIONS) {
        if (pathname.startsWith(`/${collection}/${collection}/`)) {
            const rest = pathname.slice(`/${collection}/`.length);
            return `/${rest}`;
        }
    }

    for (const collection of COLLECTIONS) {
        const mdxPrefix = `/mdx/${collection}/`;
        const docsPrefix = `/docs/${collection}/`;
        if (pathname.startsWith(mdxPrefix)) {
            const rest = pathname.slice(mdxPrefix.length);
            return `/${collection}/${rest}`;
        }
        if (pathname.startsWith(docsPrefix)) {
            const rest = pathname.slice(docsPrefix.length);
            return `/${collection}/${rest}`;
        }
    }

    if (pathname.startsWith('/mdx/plain/')) {
        const rest = pathname.slice('/mdx/plain/'.length);
        return `/${rest}`;
    }

    if (pathname.startsWith('/about/')) {
        const rest = pathname.slice('/about/'.length);
        return `/plain/about/${rest}`;
    }

      if (pathname === '/earth/masters-in-public' || pathname === '/earth/masters-in-public/' || pathname === 'earth/masters-in-public/' || pathname === 'earth/masters-in-public'){
        return '/works/thesis/meta-thesis/masters-in-public'
      }

    if (pathname === '/earth/masters-thesis' || pathname === '/earth/masters-thesis/' || pathname === 'earth/masters-thesis/' || pathname === 'earth/masters-thesis'){
        return '/works/thesis/masters-thesis'
      }
}

export const onRequest = defineMiddleware((context, next) => {
    const redirectTo = maybeRedirect(context.url.pathname);
    if (redirectTo) {
        return context.redirect(redirectTo, 301);
    }
    return next();
});
