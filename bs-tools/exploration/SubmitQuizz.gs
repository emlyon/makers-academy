// POST DATA
function doPost( e ) {
    try {
        var params = e.parameter;

        var file;
        var filename = params.course + ' exploration';

        // check if exploration file for this course already exists
        var files = DriveApp.getFilesByName( filename );
        if( files.hasNext() ) {
            file = files.next();
        }
        else {
            var coursFolder;

            // check if course folder already exists
            var folders = DriveApp.getFoldersByName( params.course );
            if( folders.hasNext() ) {
                coursFolder = folders.next();
            }
            // else create course folder in makers' academy folder
            else {
                var makersAcademyFolder = DriveApp.getFolderById( '0B1vtfsXTsmc7MF9ObjNrVVlIWjA' );
                coursFolder = makersAcademyFolder.createFolder( params.course );
            }

            // create file from exploration model file inside course folder
            var model = DriveApp.getFileById( '1raKG4fdsUo6t1hISrIH32kVVYj2OydQuOoJbX6u89v8' );
            file = model.makeCopy( filename, coursFolder );
        }

        var doc = SpreadsheetApp.open( file );
        var sheet = doc.getSheetByName( params.sheet );
        var headers = sheet.getRange( 1, 1, 1, sheet.getLastColumn() ).getValues()[ 0 ]; // get headers
        var nextRow = sheet.getLastRow() + 1; // Get next row
        var row = [ new Date() ]; // First element in the row is a timestamp

        // Loop through the header columns
        for( var i = 1; i < headers.length; i ++ ) { // Start at 1 to avoid Timestamp column
            if( headers[ i ].length > 0 ) {
                row.push( params[ headers[ i ] ] ); // Add data to row
            }
        }
        // More efficient to set values as [][] array than individually
        sheet.getRange( nextRow, 1, 1, row.length ).setValues( [ row ] );

        return ContentService.createTextOutput( JSON.stringify( {
            'result': 'success'
        } ) ).setMimeType( ContentService.MimeType.JSON );
    }
    catch( error ) {
        return ContentService.createTextOutput( JSON.stringify( {
            'result': 'error',
            'error': error,
            'e': e
        } ) ).setMimeType( ContentService.MimeType.JSON );
    }
}
