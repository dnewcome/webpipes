var http = require( 'http' );
var sys = require( 'sys' );

http.createServer( reqHandler2 ).listen( 9980 );

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

function reqHandler2( request, response ) {
	sys.puts( 'using reqHandler2' );
	request.addListener( 'data', dodata );
	response.writeHead( 200 );
	response.end();
}

function dodata( data ) {
	sys.print( data );
}

function enumerate() {
	return [ "ls", "cat" ];
}
