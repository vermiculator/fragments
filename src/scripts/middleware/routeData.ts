import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// redirects moved from astro config so they aren't static
const RDIR_MAP: Array<[string, string]> = [
    ['/md/', '/'],
    ['/md/plain/', '/'],
    ['/plain/thesis/', '/thesis/'],
    ['/plain/meta-thesis/', '/meta-thesis/'],
    ['/plain/structural/', '/structural/'],
    ['/plain/about/', '/about/'],
    ['/about/about/', '/about/'],
    ['/earth/earth/', '/earth/'],
    ['/library/library/', '/library/'],
    ['/entities/entities/', '/entities/'],
];

function maybeRedirect(pathname: string, origin: string): Response | undefined {
    for (const [legacy, modern] of RDIR_MAP) {
        if (pathname.startsWith(legacy)) {
            const rest = pathname.slice(legacy.length); // keep remaining slug
            const target = modern + rest;
            // Avoid double slashes and self-redirect loops
            const normalized = target.replace(/\/+/, '/');
            if (normalized !== pathname) {
                return Response.redirect(origin + normalized, 301);
            }
        }
    }
    return undefined;
}

export const onRequest = defineRouteMiddleware((context, next) => {

    const redirect = maybeRedirect(context.url.pathname, context.url.origin);
    if (redirect) {
        //leave empty for type signature
    }

    // e.g. `/earth/some-page#heading/` returns `/earth/`
    let currentBase = context.url.pathname.replace(/^\/(md|plain)\//, '/').split('/').slice(0, -1).join('/') + '/';
    const lastSegmentIndex = currentBase.lastIndexOf('/');
    if (lastSegmentIndex !== -1) {
        currentBase = currentBase.slice(0, lastSegmentIndex) + '/';
    }

    const { starlightRoute } = context.locals;
    const { pagination } = starlightRoute;

    // don't show fully on non-pagey pages
    if (currentBase !== '/earth/' && currentBase !== '/library/' && currentBase !== '/entities/'&& currentBase !== '/meta-thesis/' ) {
        context.locals.starlightRoute.hasSidebar = false;
    } else {
        // Remove pagination links
        if (pagination.prev && !pagination.prev.href.startsWith(currentBase)) {
            pagination.prev = undefined;
        }
        if (pagination.next && !pagination.next.href.startsWith(currentBase)) {
            pagination.next = undefined;
        }
    }

    return next();
});