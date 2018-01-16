# koa-router

A really simple route middleware for koa for giving you a simple way to manage the request.

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

If you want to add a route for multiple types of methods, you can use `router.any` method, for example:

```js
const app = new Koa();
const router new Router( app );

router.any( [ 'get', 'post' ], '/api', async ctx => {
    ctx.body = 'Method: ' + ctx.method;
} );
```

In default situation, if you pass the instance of `Koa` to the constructor of `koa-router`, `app.use` would be called automatically. Therefore, if you don't want to execute `app.use` automatically, you don't need to pass the `Koa` instance to the constructor of `koa-router`. Then, you can also call `app.use` later.

```js
const app = new Koa();
const router new Router();

app.use( router.get( '/user', async ctx => {
    ctx.body = 'User';
} ) );
```

Route paths would be parsed by [path-to-regexp](https://github.com/pillarjs/path-to-regexp);
