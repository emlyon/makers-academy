function doPost( e ){
    try {
        var params = e.parameter;

        var dropboxName = params.course + ' dropbox';
        var folder;

        //check if dropbox folder for this course already exists
        var folders = DriveApp.getFoldersByName( dropboxName );
        if( folders.hasNext() ) {
            folder = folders.next();
        }
        else {
            var courseFolder;

            // check if course folder already exists
            folders = DriveApp.getFoldersByName( params.course );
            if( folders.hasNext() ) {
                courseFolder = folders.next();
            }
            // else create course folder in makers' academy folder
            else {
                var makersAcademyFolder = DriveApp.getFolderById( '0B1vtfsXTsmc7MF9ObjNrVVlIWjA' );
                courseFolder = makersAcademyFolder.createFolder( params.course );
            }

            folder = courseFolder.createFolder( dropboxName );
        }

        // create file
        var filename = params.filename;
        var fileData = params.file;

        var contentType = fileData.substr( 5, fileData.indexOf( ';' ) ),
            bytes = Utilities.base64Decode( fileData.substr( fileData.indexOf( 'base64,' ) + 7 ) ),
            blob = Utilities.newBlob( bytes, contentType, filename ),
            file = folder.createFile( blob );

        return ContentService
            .createTextOutput(
                JSON.stringify( {
                    "result": "success"
                } )
            )
            .setMimeType( ContentService.MimeType.JSON );
    }
    catch( error ){
        return ContentService
            .createTextOutput(
                JSON.stringify( {
                    "result": "error",
                    "filename": e.parameter.filename,
                    "result": error.toString()
                } )
            )
            .setMimeType( ContentService.MimeType.JSON );
    }
}
