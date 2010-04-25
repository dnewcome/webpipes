var http = require( 'http' );
var sys = require('sys');

var si = process.openStdin();
si.addListener( 'data', function( data ) {
	sys.print( 'sending: ' + data );
	sendRequest( data );
});

function sendRequest( strData ) {
	var httpclient = http.createClient( 9980, 'www.tritonelabs.com' );
	var request = httpclient.request( 'POST', '/' );
	request.addListener( 'response', function(){});
	request.write( strData );
	request.end();
}
