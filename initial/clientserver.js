var http = require( 'http' );
var sys = require('sys');

var count = 0;

// handle commandline arguments
var listenport = parseInt( process.argv[2] );
var sendport = parseInt( process.argv[3] );
sys.puts( 'listening on port: ' + listenport );
sys.puts( 'sending to port: ' + sendport );

// the console input loop
var si = process.openStdin();
si.addListener( 'data', function( data ) {
	sys.print( 'sending: ' + data );
	sendRequest( data );
});

// send a request to the listening server
function sendRequest( strData ) {
	var httpclient = http.createClient( sendport, 'localhost' );
	var request = httpclient.request( 'POST', '/' );
	request.addListener( 'response', function(){});
	request.write( strData );
	request.end();
}

// set up a listening server
http.createServer( reqHandler2 ).listen( listenport );
function reqHandler2( request, response ) {
	sys.puts( 'using reqHandler2' );
	request.addListener( 'data', dodata );
	response.writeHead( 200 );
	response.end();
}

// this handler is called when receiving data - we 
// want to echo the received data back to the sender
// this is going to set up a loop I think
function dodata( data ) {
	count++;
	sys.puts( 'sending request: ' + count + ' ' + data );
	sendRequest( data );	
}





/// not using this 
function reqHandler( request, response ) {
	sys.puts( 'handling request' );
	response.writeHead( 200, {'Content-Type': 'text/plain'} );
	sys.puts( 'parsing request.url' );
	var path = require('url').parse( request.url ).pathname;
	sys.puts( 'parsed request.url' );
	var responsetext = "";
	if( path == '/enumerate' ) {
		responsetext = enumerate();
	}
	if( path == '/printheaders' ) {
		sys.puts( 'headers are:' );
		sys.puts( request.url );
	}
	response.write( 'chunk...\n' );
	response.end( 'server working. path: ' + path + ' responsedata: ' + responsetext );
}
