addEventListener( 'load', e => {
    document.getElementById( 'submit-links' ).addEventListener( 'click', e => {
        let data = {};

        document.querySelectorAll( 'input' ).forEach( ( d, i ) => data[ d.id ] = d.value );
        // console.log( data );

        // hide all errors spans
        document.querySelectorAll( '.input-field>span' ).forEach( span => span.style.display = 'none' );

        // check inputs content and display error span if needed
        if ( document.querySelector( '#exploration' ).value.indexOf( 'mindmeister.com/' ) == -1 ) {
            document.getElementById( 'exploration-invalid' ).style.display = 'block';
            return false;
        }
        else if( brightspace ) {
            // if everything is ok submit answers if on brightspace
            data.name = brightspace.name;
            data.course = brightspace.course;
            data.sheet = 'links';

            let submission = new Request( 'https://script.google.com/macros/s/AKfycbweJpj-iHfMNVlTDAYllMV1JMFaTQ3GUl4oKLgEFh2PCHEnCig/exec', {
                method: 'POST',
                headers: new Headers( {
                    'Content-Type': 'application/x-www-form-urlencoded'
                } ),
                body: Object.keys( data )
                    .map( k => `${ encodeURIComponent( k ) }=${ encodeURIComponent( data[ k ] ) }` )
                    .join( '&' )
            } );

            fetch( submission )
                .then( response => response.json() )
                .then( json => {
                    // console.log( json );

                    if( json.result == 'success' ) {
                        showMessage( '<h5>Link submitted successfully!</h5><p>You can send new link again by reloading the page.</p>' );
                    }
                    else {
                        showMessage( '<h5 style="color:#d50000;">There was an error!</h5><p>Please retry by reloading the page.</p>' );
                    }
                } )
                .catch( e => {
                    console.warn( e );
                    showMessage( '<h5 style="color:#d50000;">There was an error!</h5><p>Please retry by reloading the page.</p>' );
                } );
        }
    } );

    function showMessage( msg ) {
        document.querySelector( 'form' ).innerHTML = msg;
    }
} );
