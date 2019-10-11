if( !( /chrome/i.test(navigator.userAgent) || /firefox/i.test(navigator.userAgent) ) ) {
    alert( "This course works only with Chrome and Firefox browsers. You're going to be redirected." );
    window.top.location.href = 'https://emlyon.brightspace.com/';
}

parent.document.querySelector( '.d2l-page-bg' ).style.maxWidth = 'none';
parent.document.querySelector( '.d2l-max-width' ).style.maxWidth = 'none';

if( location.search ) {
    let data = {
        location: location.host
    };

    if( location.host == 'emlyon.brightspace.com' ) {
        try {
            data.module = parent.document.querySelector( 'h1' ).innerText.trim();
            data.name = parent.document.querySelector( '.d2l-navigation-s-personal-menu-text' ).innerText.trim();
            data.course = parent.document.querySelector( 'a.d2l-navigation-s-link' ).title.trim().split( ' ' )[ 0 ];
        }
        catch ( e ) {
            console.log( e );
        }
    }

    let iframe = document.querySelector( 'iframe' );
    iframe.src = location.search.substr( 1 );
    data.iframeUrl = location.search.substr( 1 );
    // console.log( iframe.src );

    iframe.addEventListener( 'load', () => {
        iframe.contentWindow.postMessage( data, iframe.src );

        addEventListener( 'resize', () => {
            iframe.contentWindow.postMessage( data, iframe.src );
        }, false );
    }, false );

    addEventListener( 'message', event => {
        // console.log( event );

        /*
         * if( event.origin !== 'https://emlyon.github.io' )
         *     return;
         */

        // Resize iframe and parent iframe
        if( event.data.height ) {
            iframe.height = event.data.height;

            if( parent ) {
                parent.document.querySelectorAll( 'iframe' ).forEach( frame => {
                    if( frame.src == location.href ) {
                        frame.height = event.data.height;
                    }
                } );
            }
        }
    }, false );
}
