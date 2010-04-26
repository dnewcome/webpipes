/* here we are testing whether it is possible to post a file 
and download it at the same time
*/
var http = require( 'http' );
var sys = require('sys');
var count;

// handle commandline arguments
var listenport = parseInt( process.argv[2] );
sys.puts( 'listening on port: ' + listenport );

// set up a listening server
http.createServer( function( req, res ) {
	sys.puts( 'using inline handler' );
	count = 0;
	// since we add the data handler function inline
	// un the request handler, we have access lexically
	// to response
	req.addListener( 'data', function( data ){
		// debug output
		sys.puts( 'called data handler ' + ++count );
		sys.puts( data );

		// here we echo the data
		res.write( data );
	});

	// close the response only after the request is closed
	// otw data may still be in flight when resp is closed
	req.addListener( 'end', function(){ res.end(); } )
	res.writeHead( 200 )
}).listen( listenport );
