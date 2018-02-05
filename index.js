const is = require( '@lvchengbin/is' );
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

            let matches;

            if( is.regexp( path ) ) {
                path.lastIndex = 0;
                matches = path.exec( ctx.path );
            } else if( is.object( path ) ) {
                const keys = Object.keys( path );
                const query = ctx.query;
                matches = [ true ];

                for( let key of keys ) {
                    if( is.undefined( query[ key ] ) ) {
                        matches = false;
                        break;
                    }

                    if( is.regexp( path[ key ] ) ) {
                        path[ key ].lastIndex = 0;
                        if( !path[ key ].test( query[ key ] ) ) {
                            matches = false;
                            break;
                        }
                    } else if( query[ key ] != path[ key ] ) {
                        matches = false;
                        break;
                    }
                }

            } else {
                matches = re( path, keys, options ).exec( ctx.path );
            }

            if( matches ) {
                const args = matches.slice( 1 ).map( v => decodeURIComponent( v ) );
                return Promise.resolve( fn.call( this.app, ctx, next, ...args ) );
            }
            return next();
        };
        return this.app ? this.app.use( func ) : func;
    };

}

class Router {
    constructor( app ) {
        this.app = app;

        for( let method of methods ) {
            this[ method.toLowerCase() ] = createMethod.call( this, method );
        }


    }
    any( m, path, fn, options = {} ) {
        const handler = createMethod.call( this );
        options.methods = m === '*' ? methods : m;
        return handler( path, fn, options );
    }
}

module.exports = Router;
