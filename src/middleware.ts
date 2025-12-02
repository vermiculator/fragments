import { defineMiddleware } from 'astro:middleware';

// redirects moved from astro config so they aren't static
const RDIR_MAP: Array<[string, string]> = [
    ['/mdx/library/library', '/library'],
    ['/mdx/earth/earth', '/earth'],
    ['/mdx/entities/entities', '/entities'],
    ['/mdx/library', '/library'],
    ['/mdx/earth', '/earth'],
    ['/mdx/entities', '/entities'],
    ['/md/library/library', '/library'],
    ['/md/earth/earth', '/earth'],
    ['/md/entities/entities', '/entities'],
    ['/md/library', '/library'],
    ['/md/earth', '/earth'],
    ['/md/entities', '/entities'],
    ['/about/about/', '/about/'],
    ['/earth/earth/', '/earth/'],
    ['/library/library/', '/library/'],
    ['/entities/entities/', '/entities/'],
    ['/mdx/plain', '/'],
    ['/md/plain', '/'],
    ['/mdx', '/'],
    ['/md', '/'],
    ['/plain', '/'],
];

function maybeRedirect(pathname: string): string | undefined {
    // Exact match for /thesis root
    if (pathname === '/thesis' || pathname === '/thesis/') {
        return '/thesis/masters-thesis';
    }
    for (const [oldPath, newPath] of RDIR_MAP) {
        if (pathname.startsWith(oldPath)) {
            const rest = pathname.slice(oldPath.length); // keep remaining slug
            const target = newPath + rest;
            // Avoid double slashes and self-redirect loops
            const normalized = target.replace(/\/+/g, '/');
            if (normalized !== pathname) {
                return normalized;
            }
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
