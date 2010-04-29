/*
runs the command 'cat' 
we take the post data as standard input to 'cat'
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

	// as a test here we use one of the js files on the filesystem
	// as output along with stdin
	var ls = spawn('cat', ['cat-command.js', '-']);

	// write data to response any time we have data on stdout
	ls.stdout.addListener('data', function(data) {
		res.write( data );			
	});

	// end the http response when 'cat' proc exits
	ls.addListener('exit', function(){
		res.end();
	});

	// write data from http post to stdin of 'cat'
	// as it appears
	req.addListener( 'data', function( data ){
		sys.puts( 'called data handler ' + ++count );
		// sys.puts( data );
		ls.stdin.write( data );
	});

	// previously when request ended we ended response, now we
	// close stdin, which should trigger command to exit, 
	// which will trigger end of response
	req.addListener( 'end', function(){ ls.stdin.end(); } )
	res.writeHead( 200 )
}).listen( listenport );
