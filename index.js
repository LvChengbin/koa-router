const is = require( '@lvchengbin/is' );
const re = require( 'path-to-regexp' );

const methods = [ 'HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE' ];

function match( path, ctx, options ) {
    let matches;

    if( is.regexp( path ) ) {
        path.lastIndex = 0;
        matches = path.exec( ctx.path );
    } else if( is.object( path ) ) {
        const keys = Object.keys( path );
        const query = ctx.query;
        matches = [ true ];

        for( let key of keys ) {
            const item = path[ key ];

            if( item === false && is.undefined( query[ key ] ) ) {
                continue;
            }

            if( is.undefined( query[ key ] ) ) {
                matches = false;
                break;
            }

            if( is.regexp( item ) ) {
                path[ key ].lastIndex = 0;
                if( !path[ key ].test( query[ key ] ) ) {
                    matches = false;
                    break;
                }
            } else if( is.array( item ) ) {
                if( item.indexOf( query[ key ] ) < 0 ) {
                    matches = false;
                    break;
                }
            } else if( item === true ) {
                continue;
            } else if( query[ key ] != path[ key ] ) {
                matches = false;
                break;
            }
        }

    } else {
        const keys = [];
        matches = re( path, keys, options ).exec( ctx.path );

        if( matches ) {
            ctx.params = {};

            for( let i = 0, l = keys.length; i < l; i += 1 ) {
                const name = keys[ i ].name;
                ctx.params[ name ] = matches[ i + 1 ];
            }
        }
    }

    return matches;
}

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

            let matches;

            if( is.generator( path ) ) {
                for( const i of path() ) {
                    matches = match( i, ctx, options );
                    if( matches ) break;
                }
            } else if( is.array( path ) ) {
                for( const i of path ) {
                    matches = match( i, ctx, options );
                    if( matches ) break;
                }
            } else {
                matches = match( path, ctx, options );
            }
            if( matches ) {
                const args = matches.slice( 1 ).map( v => decodeURIComponent( v ) );
                ctx.routerMatches = args;
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
        this.methods = methods;
        for( let method of methods ) {
            this[ method.toLowerCase() ] = function( path, fn, options ) {
                if( is.iterable( fn ) ) {
                    for( const f of fn ) {
                        this[ method.toLowerCase() ]( path, f, options );
                    }
                    return;
                }
                createMethod.call( this, method )( ...arguments );
            }
        }
    }

    any( m, path, fn, options = {} ) {
        const handler = createMethod.call( this );
        options.methods = m === '*' ? methods : m;

        if( is.iterable( fn ) ) {
            for( const f of fn ) {
                this.any( m, path, f, options );
            }
            return;
        }
        return handler( path, fn, options );
    }
}

module.exports = Router;
