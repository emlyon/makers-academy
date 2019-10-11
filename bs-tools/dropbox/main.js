addEventListener( 'load', e => {
    let group, phase;
    let file, reader = new FileReader();

    function checkBS() {
        if( brightspace ) {
            let url = new URL( brightspace.iframeUrl );
            let params = url.searchParams;
            group = params.get( 'gr' );

            if ( group ) {
                $( 'select' ).material_select();

                document.body.style.overflow = 'auto';
                document.querySelector( '.phase-select' ).style.display = 'block';
                document.body.style.overflow = 'auto';

                let selectBtn = document.querySelector( '.file-field>.btn' );
                selectBtn.classList.add( 'lighten-4' );
                selectBtn.addEventListener( 'click', e => {
                    showMessage( '' );
                    if( selectBtn.classList.contains( 'lighten-4' ) ) {
                        e.preventDefault();
                        showError( '<p>Please select your phase first.</p>' );
                    }
                } );

                Reflect.apply(
                    [].forEach,
                    document.querySelectorAll( '.select-dropdown>li:not(.disabled)' ),
                    [ li => li.addEventListener( 'click', e => {
                        phase = e.target.innerText.split( '.' )[ 0 ];

                        selectBtn.classList.remove( 'lighten-4' );

                        // console.log( phase );
                    } ) ]
                );
            }
        }
        else {
            setTimeout( checkBS, 5000 );
        }
    }
    setTimeout( checkBS, 50 );

    reader.onloadend = e => {
        if( e.target.error != null ) {
            showError( `File ${ file.name } could not be read.` );

            return;
        }

        if( brightspace ) {
            let data = {
                filename: `${ file.name }`,
                file: e.target.result,
                course: brightspace.course
            };

            if( group &&  phase ) {
                data.filename = `GR${ group }_${ phase } - ${ brightspace.name }.pdf`;
            }

            let submission = new Request( 'https://script.google.com/macros/s/AKfycbzp6wdrhRO9CLzbsw1Yv9gcK1ha7mWM0vxRV29whHHWPxH4yzFR/exec', {
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
                    if( json.result == 'success' ) {
                        document.getElementById( 'forminner' ).style.display = 'none';
                        showMessage( '<h5>Your file has been successfully uploaded!</h5>');
                    }
                    else {
                        console.log( json );

                        showError( '<p>Error while uploading your file.<br>Please retry.<p>' );
                    }
                } )
                .catch( e => {
                    console.warn( e );
                    showError( '<p>Error while uploading your file.<br>Please retry.<p>' );
                } );
        }
    };

    let filesInput = document.getElementById( 'files-input' );
    let filesSpan = document.getElementById( 'files-span' );
    let submitBtn = document.getElementById( 'submit-dropbox' );
    let progress = document.getElementById( 'progress' );

    filesInput.addEventListener( 'change', e => {
        if( filesInput.files.length > 0 ) {
            filesSpan.innerText = filesInput.files[ 0 ].name;

            submitBtn.classList.remove( 'lighten-4' );
        }
        else {
            filesSpan.innerText = 'Select a file on your computer';

            submitBtn.classList.add( 'lighten-4' );
        }
    } );

    submitBtn.addEventListener( 'click', e => {
        e.preventDefault();

        let files = filesInput.files;

        if ( files.length === 0 ) {
            showError( '<p>Please select a file to upload<p>' );

            return;
        }

        file = files[ 0 ];
        console.log( file );

        if ( file.size > 1024 * 1024 * 25 ) {
            showError( '<p>The file size should be less than 25 MB.<p>' );

            return;
        }

        showMessage( '<p>Uploading file...<br>Wait until upload completes.<p>' );

        reader.readAsDataURL( file );
    }, false );

    function showError( err ) {
        progress.classList.add( 'red-text' );
        progress.innerHTML = err;
    }

    function showMessage( msg ) {
    progress.classList.remove( 'red-text' );
    progress.innerHTML = msg;
}
} );
