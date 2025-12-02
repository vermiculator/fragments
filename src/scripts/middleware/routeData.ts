import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

export const onRequest = defineRouteMiddleware((context, next) => {

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