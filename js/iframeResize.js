[].forEach.call( document.querySelectorAll( 'iframe' ), iframe => {
    iframe.addEventListener( 'load', () => {
        iframe.contentWindow.postMessage( {tutorView: true}, iframe.src );

        addEventListener( 'resize', () => {
            iframe.contentWindow.postMessage( {tutorView: true}, iframe.src );
        }, false );
    }, false );

    addEventListener( 'message', event => {
        // console.log( event );

        // Resize iframe
        if( event.data.height && event.data.location == iframe.src ) {
            iframe.height = Math.floor( event.data.height );
        }
    }, false );
} );
