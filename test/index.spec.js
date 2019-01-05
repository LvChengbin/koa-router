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
        request( app.listen() ).get( '/x/y/z' )
            .expect( {
                a : 'x',
                b : 'y',
                c : 'z',
                matches : [ 'x', 'y', 'z' ]
            } )
            .end( err => err ? done.fail( err ) : done() );

    } );

    it( 'regexp', done => {
        request( app.listen() ).get( '/1/2/3' )
            .expect( {
                m : '1',
                n : '2',
                i : '3',
                matches : [ '1', '2', '3' ]
            } )
            .end( err => err ? done.fail( err ) : done() );

    } );

    it( 'match query', done => {
        request( app.listen() ).get( '/xxx?query=abcd' )
            .expect( 'abcd' )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'regexp query', done => {
        request( app.listen() ).get( '/xxx?m=123' )
            .expect( '123' )
            .end( err => err ? done.fail( err ) : done() );
    } );
} );

describe( 'multiple paths with an array', () => {
    it( 'arr1', done => {
        request( app.listen() ).get( '/mul/arr1/x/y' )
            .expect( 200 )
            .expect( {
                m : 'x',
                n : 'y',
                matches : [ 'x', 'y' ]
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'arr2', done => {
        request( app.listen() ).get( '/mul/arr2/m/n' )
            .expect( 200 )
            .expect( {
                m : 'm',
                n : 'n',
                matches : [ 'm', 'n' ]
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );
} );

describe( 'multiple paths with an array', () => {
    it( 'gen1', done => {
        request( app.listen() ).get( '/mul/gen1/x/y' )
            .expect( 200 )
            .expect( {
                m : 'x',
                n : 'y',
                matches : [ 'x', 'y' ]
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );

    it( 'gen2', done => {
        request( app.listen() ).get( '/mul/gen2/m/n' )
            .expect( 200 )
            .expect( {
                m : 'm',
                n : 'n',
                matches : [ 'm', 'n' ]
            } )
            .end( err => err ? done.fail( err ) : done() );
    } );
} );

describe( 'multiple middleware', () => {
    it( 'should be stuck by a middleware', done => {
        request( app.listen() ).get( '/mul/stuck' )
            .expect( 200 )
            .expect( 'stuck' )
            .end( err => err ? done.fail( err ) : done() );
    } ); 

    it( 'should finish all middlewares', done => {
        request( app.listen() ).get( '/mul/finish' )
            .expect( 200 )
            .expect( '123' )
            .end( e => e ? done.fail( e ) : done() );
    } );

    it( 'should finish all middlewares', done => {
        request( app.listen() ).get( '/mul/any/finish' )
            .expect( 200 )
            .expect( '123' )
            .end( e => e ? done.fail( e ) : done() );
    } );
} );
