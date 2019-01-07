# koa-router

A simple routing middleware for koa which can match path string, and queries.

## Installation

```js
$ npm i @lvchengbin/koa-router --save
```
## Usage

A simple example:

```js
const Koa = require( 'koa' );
const Router = require( '@lvchengbin/koa-router' );

const app = new Koa();
const router = new Router( app );

router.get( '/user', async ctx => {
    ctx.body = 'User';
} );

router.get( '/user/:id', async ( ctx, next, id ) => {
    ctx.body = 'User: ' + id;
} );

router.post( '/add', async ctx => {
    ctx.body = 'Add data';
} );

app.listen( 3000 );
```

You can also use `RegExp` for the router:

```js
const Koa = require( 'koa' );
const Router = require( '@lvchengbin/koa-router' );

const app = new Koa();
const router = new Router( app );

router.get( /^\/user\/(\d+)/, async ( ctx, next, id ) => {
    ctx.body = id;
} );

app.listen( 3000 );
```

You can also try matching queries in query string:

```js
const Koa = require( 'koa' );
const Router = require( '@lvchengbin/koa-router' );

const app = new Koa();
const router = new Router( app );

// match all requests with a query responseType and it's value should be jsonp
router.get( { responseType : 'jsonp' } , async ( ctx, next ) => {
    ctx.body = id;
} );

// match all id start with 1
router.get( { id : /^1(\d+)/ }, async ctx => {
} );

app.listen( 3000 );
```

If you want to add a route for multiple types of methods, you can use `router.any` method, for example:

```js
const app = new Koa();
const router = new Router( app );

router.any( [ 'get', 'post' ], '/api', async ctx => {
    ctx.body = 'Method: ' + ctx.method;
} );
```

Using asterisk (*) as the first argument of `router.any` would match all methods:

```js
router.any( '*', '/api', async ctx => {
    ctx.body = 'This would be execute with all methods';
} );
```

Multiple `path`s can be set as an `Array` or a `Generator` in one rule:

```js
// using an array
router.get( [ '/path/a', '/path/b' ], async ( ctx, next ) => {
} );

// using a generator
router.get( function*() {
    yield '/path/a';
    yield '/path/b';
}, async ( ctx, next ) => {
} );
```

In default situation, if you pass the instance of `Koa` to the constructor of `koa-router`, `app.use` would be called automatically. Therefore, if you don't want to execute `app.use` automatically, you don't need to pass the `Koa` instance to the constructor of `koa-router`. Then, you can also call `app.use` later.

```js
const app = new Koa();
const router = new Router();

app.use( router.get( '/user', async ctx => {
    ctx.body = 'User';
} ) );
```

To execute multiple middlewares with a routing rule.

```js
const app = new Koa();
const router = new Router( app );

router.get( '/', [
    ( ctx, next ) => {
        next();
    },
    ctx => {
        ctx.body = 'Hello world!';
    }
] );
```

Route paths would be parsed by [path-to-regexp](https://github.com/pillarjs/path-to-regexp);
