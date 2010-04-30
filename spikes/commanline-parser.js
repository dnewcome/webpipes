/*
evolving the idea to parse a commandline and alternatively get
data from another file as stdin instead of post data
*/
var http = require( 'http' );
var sys = require('sys');

// handle commandline arguments
var listenport = parseInt( process.argv[2] );
sys.puts( 'listening on port: ' + listenport );

// run a unix command
function unixCommand( req, res, cmd, cmdargs ) {
	var spawn = require('child_process').spawn;

	// as a test here we use one of the js files on the filesystem
	// as output along with stdin
	var command = spawn(cmd, cmdargs);

	// write data to response any time we have data on stdout
	command.stdout.addListener('data', function(data) {
		res.write( data );			
	});

	// end the http response when proc exits
	command.addListener('exit', function(){
		res.end();
	});

	// write data from http post to stdin 
	// as it appears
	req.addListener( 'data', function( data ){
		sys.puts( 'called data handler ' + ++count );
		// sys.puts( data );
		command.stdin.write( data );
	});
	// note that the first stdin method to finish will end the command
	// req.addListener( 'end', function(){ ls.stdin.end(); } )

	// we need to have the command so we can work with stdin
	return command;
}

// specific url parsing for handling a unix command call
// url is of form /<cmd>?stdin=<url>&args=['<arg1>', ... ]
function parseUnixUrl( url ) {
	sys.puts( 'parsing url: ' + url );
	
	var path = require('url').parse( url ).pathname;
	var cmd = path.replace('/','');
	var querystring = require('url').parse( url, true );
	var stdin = querystring.query.stdin; 
	var cmdargs = eval(querystring.query.args);
	sys.puts(querystring.query.args);
	sys.puts(cmd);
	return { name: cmd, args: cmdargs, stdin: stdin };
}

// set up a listening server
http.createServer( function( req, res ) {
	sys.puts( 'running http request handler' );

	var cmd = parseUnixUrl( req.url );
	var command = unixCommand( req, res, cmd.name, cmd.args );
	getStdinUrl( cmd.stdin, command );

	res.writeHead( 200 )
}).listen( listenport );

// if we passed an url to use for stdin, fetch it
// stdin is an url passed as a string
// command is the unix command that we are running
function getStdinUrl( stdin, command ) {
	// we take stdin from an external url if given argument 'stdin'
	// TODO: currently if both post data and url are given we will mix the two
	if( stdin && stdin != "" ) {
		function dataCallback( data ) {
			sys.puts( 'running stdin data listener' );
			command.stdin.write( data );	
		}
		function endCallback(){
			command.stdin.end();
		}
		getFileUrl( stdin, dataCallback, endCallback );
	}	
}

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

