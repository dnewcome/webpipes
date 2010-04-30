/*
evolving the idea to parse a commandline and alternatively get
data from another file as stdin instead of post data
*/
var http = require( 'http' );
var sys = require('sys');
var unixcmd = require('./unixcmd');

// handle commandline arguments
var listenport = parseInt( process.argv[2] );
sys.puts( 'listening on port: ' + listenport );

// set up a listening server
http.createServer( function( req, res ) {
	sys.puts( 'running http request handler' );

	var cmd = unixcmd.parseUnixUrl( req.url );
	var command = unixcmd.unixCommand( req, res, cmd.name, cmd.args );
	unixcmd.getStdinUrl( cmd.stdin, command );

	res.writeHead( 200 )
}).listen( listenport );

