window.brightspace = undefined;

addEventListener( 'message', event => {
    // console.log( event );

    if( event.origin == 'https://emlyon.brightspace.com' || event.data.tutorView ) {
        Reflect.apply(
            [].forEach,
            document.querySelectorAll( '.bs-only' ),
            [ el => el.style.display = 'block' ]
        );

        Reflect.apply(
            [].forEach,
            document.querySelectorAll( '.not-on-bs' ),
            [ el => el.style.display = 'none' ]
        );

        brightspace = {
            name: event.data.name,
            course: event.data.course,
            module: event.data.module,
            iframeUrl: event.data.iframeUrl
        };
    }

    let postData = () => {
        document.body.style.overflow = 'auto';

        let data = {};
        data.location = location.href;
        data.height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        event.source.postMessage( data, event.origin );

        document.body.style.overflow = 'hidden';
    }
    postData();
    addEventListener( 'resize', postData );
}, false );
