const Koa = require( 'koa' );
const Router = require( '../index' );

const app = new Koa();
const router = new Router( app );


router.any( '*', '/', async ( ctx, next ) => {
    ctx.body = {
        method : ctx.method
    };
    next();
} );

router.get( '/', async ctx => {
    ctx.body.x = 'get';
} );

router.post( '/', async ctx => {
    ctx.body.x = 'post';
} );

router.options( '/', async ctx => {
    ctx.set( 'Access-Control-Allow-Origin', '*' );
    ctx.body.x = 'options';
} );

router.put( '/', async ctx => {
    ctx.body.x = 'put';
} );

router.get( '/mul/finish', [
    ( ctx, next ) => {
        ctx.body = '1';
        return next();
    },
    ( ctx, next ) => {
        ctx.body += '2';
        return next();
    }, 
    ctx => {
        ctx.body += '3';
    }
] );


router.any( '*', '/mul/any/finish', [
    ( ctx, next ) => {
        ctx.body = '1';
        return next();
    },
    ( ctx, next ) => {
        ctx.body += '2';
        return next();
    }, 
    ctx => {
        ctx.body += '3';
    }
] );

router.any( '*', /\/reg/, async ( ctx, next ) => {
    ctx.body = {
        method : ctx.method
    };
    next();
} );

router.get( /\/reg/, async ctx => {
    ctx.body.x = 'get';
} );

router.post( /\/reg/, async ctx => {
    ctx.body.x = 'post';
} );

router.options( /\/reg/, async ctx => {
    ctx.set( 'Access-Control-Allow-Origin', '*' );
    ctx.body.x = 'options';
} );

router.put( /\/reg/, async ctx => {
    ctx.body.x = 'put';
} );

router.get( /\/(\d+)\/(\d+)\/(\d+)/, async ( ctx, next, m, n, i ) => {
    ctx.body = { m, n, i, matches : ctx.routerMatches };
} );

router.get( '/:a/:b/:c', async ( ctx, next, a, b, c ) => {
    ctx.body = { a, b, c, matches : ctx.routerMatches };
} );

router.get( { query : 'abcd' }, async ctx => {
    ctx.body = ctx.query.query;
} );

router.get( { m : /^\d+$/ }, async ctx => {
    ctx.body = ctx.query.m
} );

router.get( [ '/mul/arr1/:a/:b', /mul\/arr2\/([^/]+)\/([^/]+)/ ], async( ctx, next, m, n ) => {
    ctx.body = {
        m, n,
        matches : ctx.routerMatches
    }
} );

router.get( function*() {
    yield '/mul/gen1/:a/:b';
    yield /mul\/gen2\/([^/]+)\/([^/]+)/;
}, async( ctx, next, m, n ) => {
    ctx.body = {
        m, n,
        matches : ctx.routerMatches
    }
} );

router.get( '/mul/stuck', ctx => {
    ctx.body = 'stuck';
}, ctx => {
    ctx.body += 'finished';
} );

router.get( '/mul/finish', [
    ( ctx, next ) => {
        ctx.body = '1';
        return next();
    },
    ( ctx, next ) => {
        ctx.body += '2';
        return next();
    }, 
    ctx => {
        ctx.body += '3';
    }
] );


router.any( '*', '/mul/any/finish', [
    ( ctx, next ) => {
        ctx.body = '1';
        return next();
    },
    ( ctx, next ) => {
        ctx.body += '2';
        return next();
    }, 
    ctx => {
        ctx.body += '3';
    }
] );
module.exports = app;
