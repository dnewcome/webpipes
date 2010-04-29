/*
evolving the idea to parse a commandline and alternatively get
data from another file as stdin instead of post data
*/
var http = require( 'http' );
var sys = require('sys');
var count;

// handle commandline arguments
var listenport = parseInt( process.argv[2] );
sys.puts( 'listening on port: ' + listenport );

// set up a listening server
http.createServer( function( req, res ) {
	sys.puts( 'running request handler' );

	// number of times that the data handler has run
	count = 0;

	// url parsing stuff
	sys.puts( req.url );
	var path = require('url').parse( req.url ).pathname;
	var cmd = path.replace('/','');
	var querystring = require('url').parse( req.url, true );
	var stdin = querystring.query.stdin; 
	var cmdargs = eval(querystring.query.args);
	sys.puts(querystring.query.args);
	sys.puts(cmd);

	var spawn = require('child_process').spawn;

	// as a test here we use one of the js files on the filesystem
	// as output along with stdin
	var ls = spawn(cmd, cmdargs);
	// var ls = spawn(cmd, ['ls-command.js']);

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
	// note that the first stdin method to finish will end the command
	// req.addListener( 'end', function(){ ls.stdin.end(); } )

	// we take stdin from an external url if given argument 'stdin'
	// TODO: currently if both post data and url are given we will mix the two
	if( stdin && stdin != "" ) {
		sys.puts('retrieving stdin from url');
		var stdinurl = require('url').parse( stdin );
		var portno = stdinurl.port || 80;
		var httpclient = http.createClient( portno, stdinurl.hostname );
		var request = httpclient.request( 'GET', stdinurl.pathname );
		request.addListener( 'response', function( response ){
			sys.puts('running stdin response listener');
			response.addListener('data', function( data ) {
				sys.puts( 'running stdin data listener' );
				ls.stdin.write( data );	
			});
			response.addListener('end', function(){ls.stdin.end() });
		});
		request.end();
			
	}	

	res.writeHead( 200 )
}).listen( listenport );
