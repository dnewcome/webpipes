/*
evolving the idea to parse a commandline and alternatively get
data from another file as stdin instead of post data
*/
var http = require( 'http' );
var sys = require('sys');
var unixcmd = require('./unixcmd');
var jathparse = require('./jathparse');
var util = require('./util');

// handle commandline arguments
var listenport = parseInt( process.argv[2] );
sys.puts( 'listening on port: ' + listenport );

// set up a listening server
http.createServer( function( req, res ) {
	sys.puts( 'running http request handler' );
	sys.puts( 'request url is: ' + req.url );

	res.writeHead( 200 )
	doJath();
//	doUnix();

	function doJath() {
		jathparse.parse( req, res );			
	}

	function doUnix() {
		var cmd = unixcmd.parseUnixUrl( req.url );
		var command = unixcmd.unixCommand( req, res, cmd.name, cmd.args );
		unixcmd.getStdinUrl( cmd.stdin, command );
	}

}).listen( listenport );

