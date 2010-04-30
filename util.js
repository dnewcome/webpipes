var sys = require( 'sys' );
var http = require( 'http' );

/**
* utilities used by all webpipes command runners
*/
exports.getFileUrl = getFileUrl;

// fetch any data from urls given as file arguments
// url = the url to fetch
// dataCallback = the callback function for handling return data chunks
function getFileUrl( url, dataCallback, endCallback ) {
	sys.puts('fetching from url: ' + url );
	var stdinurl = require('url').parse( url );
	var portno = stdinurl.port || 80;
	var httpclient = http.createClient( portno, stdinurl.hostname );
	var request = httpclient.request( 'GET', stdinurl.pathname, { host: stdinurl.hostname} );
	request.addListener( 'response', function( response ){
		sys.puts('running response listener');
		sys.puts('statuscode: ' + response.statusCode );
		
		response.addListener('data', dataCallback ); 
		response.addListener('end', endCallback );
	});
	request.end();
}
