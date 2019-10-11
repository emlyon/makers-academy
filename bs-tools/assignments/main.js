addEventListener( 'load', e => {
    document.getElementById( 'submit-links' ).addEventListener( 'click', e => {
        let data = {};

        document.querySelectorAll( 'input' ).forEach( ( d, i ) => data[ d.id ] = d.value );
        // console.log( data );

        // hide all errors spans
        document.querySelectorAll( '.input-field>span' ).forEach( span => span.style.display = 'none' );

        // check inputs content and display error span if needed
        if ( document.querySelector( '#print' ).value.indexOf( 'thingiverse.com/' ) == -1 ) {
            document.getElementById( 'print-invalid' ).style.display = 'block';
            return false;
        }
        else if ( document.querySelector( '#web' ).value.indexOf( 'codepen.io/' ) == -1 ) {
            document.getElementById( 'web-invalid' ).style.display = 'block';
            return false;
        }
        else if ( document.querySelector( '#laser' ).value.indexOf( 'thingiverse.com/' ) == -1 ) {
            document.getElementById( 'laser-invalid' ).style.display = 'block';
            return false;
        }
        else if ( document.querySelector( '#arduino' ).value.indexOf( 'tinkercad.com/' ) == -1 ) {
            document.getElementById( 'arduino-invalid' ).style.display = 'block';
            return false;
        }
        else if( brightspace ) {
            // if everything is ok submit answers if on brightspace
            data.name = brightspace.name;
            data.course = brightspace.course;
            data.sheet = 'links';

            let submission = new Request( 'https://script.google.com/macros/s/AKfycbwBrvVMqflcBnDJNjAHg6y_9pooKwOPgYsvkK2fqq8-P7K0n2FB/exec', {
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
                        showMessage( '<h5>Links submitted successfully!</h5><p>You can send new links again by reloading the page.</p>' );
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
