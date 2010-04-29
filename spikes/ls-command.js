/* initial attempt at running a command
runs the command 'ls' and returns it via webpage response
note that eventually we want to take stdin.. right now we 
don't .. one of the issues here is knowing when to end the web
response, here we end it when the command exits.. previously 
we ended it when the client was finished sending data.. 
so if we are looking for data on stdin, we are going to do things differently
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

	var spawn = require('child_process').spawn;
	var ls = spawn('ls');
	ls.stdout.addListener('data', function(data) {
		res.write( data );			
	});
	ls.addListener('exit', function(){
		res.end();
	});

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
//	req.addListener( 'end', function(){ res.end(); } )
	res.writeHead( 200 )
}).listen( listenport );
