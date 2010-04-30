var sys = require( 'sys' );
var http = require( 'http' );
var parseurl = require('url').parse;

/**
* utilities used by all webpipes command runners
*/
exports.getFileUrl = getFileUrl;
exports.postData = postData;

// fetch any data from urls given as file arguments
// url = the url to fetch
// dataCallback = the callback function for handling return data chunks
function getFileUrl( url, dataCallback, endCallback ) {
	sys.puts('fetching from url: ' + url );
	var stdinurl = parseurl( url );
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

// post data to destination url
// TODO: can we merge get and post so we only have one method?
function postData( url, dataCallback, endCallback ) {
	var parsedurl = parseurl( url );	
	var port = parsedurl.port || 80;
	sys.puts('posting data to: ' + parsedurl.hostname + ' ' + port + ' ' + parsedurl.pathname );
	var client = http.createClient( port, parsedurl.hostname );
	var request = client.request( 'POST', parsedurl.pathname + parsedurl.search, { host: parsedurl.hostname } );
	request.addListener( 'response', function( response ) {
		sys.puts( 'running post response listener' );	
		
		response.addListener('data', dataCallback ); 
		response.addListener('end', endCallback );
	});
	return request;
}
