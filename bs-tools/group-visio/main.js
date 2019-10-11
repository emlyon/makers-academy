let group;

addEventListener( 'load', e => {
    setTimeout( () => {
        let url = new URL( brightspace.iframeUrl );
        let params = url.searchParams;
        group = params.get( 'gr' );

        let visioIframe = document.getElementById( 'visio-iframe' );
        visioIframe.src = `https://appear.in/${ brightspace.course.split( ' ' )[ 0 ].toLowerCase() }gr${ group }`;

        console.log( visioIframe.src );
    }, 50 );
} );
