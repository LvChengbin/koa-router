const app = require( './app' );
const request = require( 'supertest' );

describe( 'router path', () => {
    [ 'get', 'post', 'options', 'put' ].forEach( method => {
        it( method, done => {
            request( app.listen() )[ method ]( '/' )
                .expect( 200 )
                .expect( {
                    method : method.toUpperCase(),
                    x : method
                } )
                .end( err => err ? done.fail( err ) : done() );
        } );
    } );
} );

describe( 'router regex', () => {
    [ 'get', 'post', 'options', 'put' ].forEach( method => {
        it( method, done => {
            request( app.listen() )[ method ]( '/reg' )
                .expect( 200 )
                .expect( {
                    method : method.toUpperCase(),
                    x : method
                } )
                .end( err => err ? done.fail( err ) : done() );
        } );
    } );
} );

describe( 'complex', () => {
    it( 'path', done => {
        request( app.listen() )
            .get( '/x/y/z' )
            .expect( {
                a : 'x',
                b : 'y',
                c : 'z'
            } )
            .end( err => err ? done.fail( err ) : done() );

    } );

    it( 'regexp', done => {
        request( app.listen() )
            .get( '/1/2/3' )
            .expect( {
                m : '1',
                n : '2',
                i : '3'
            } )
            .end( err => err ? done.fail( err ) : done() );

    } );

    it( 'match query', done => {
        request( app.listen() )
            .get( '/xxx?query=abcd' )
            .expect( 'abcd' )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'regexp query', done => {
        request( app.listen() )
            .get( '/xxx?m=123' )
            .expect( '123' )
            .end( err => err ? done.fail( err ) : done() );
    } );
} );
