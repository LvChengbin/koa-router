const re = require( 'path-to-regexp' );

const methods = [ 'HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE' ];

function createMethod( method ) {

    return ( path, fn, options = {} ) => {
        const func = async ( ctx, next ) => {

            if( method ) {
                if( ctx.method !== method ) return next();
            } else {
                /**
                 * if the method wasn't specified during create the "method" function,
                 * to use the methods in options instead.
                 */
                if( !options.methods || !options.methods.length ) {
                    options.methods = [ 'GET' ];
                }
                if( !Array.isArray( options.methods ) ) {
                    options.methods = [ options.methods ];
                }
                options.methods = options.methods.map( m => m.toUpperCase() );

                if( options.methods.indexOf( ctx.method ) < 0 ) return next();
            }

            const keys = [];

            const matches = re( path, keys, options ).exec( ctx.path );

            if( matches ) {
                const args = matches.slice( 1 ).map( v => decodeURIComponent( v ) );
                return Promise.resolve( fn.call( this.app, ctx, next, ...args ) );
            }

            return next();
        };

        if( this.app ) {
            return this.app.use( func );
        }

        return func;
    };

}

class Router {
    constructor( app ) {
        this.app = app;

        for( let method of methods ) {
            this[ method.toLowerCase() ] = createMethod.call( this, method );
        }


    }
    any( methods = [ 'GET', 'POST' ], path, fn, options = {} ) {
        const handler = createMethod.call( this );
        options.methods = methods;
        return handler( path, fn, options );
    }
}

module.exports = Router;
