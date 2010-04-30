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
	var request = httpclient.request( 'GET', stdinurl.pathname );
	request.addListener( 'response', function( response ){
		sys.puts('running stdin response listener');
		response.addListener('data', dataCallback ); 
		// i wonder if we can use the same callback, just
		// check for data .. end won't pass an arg
		response.addListener('end', endCallback );
	});
	request.end();
}
