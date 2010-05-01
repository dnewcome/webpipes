/*
* Webpipes sreaming node server
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
	var commands = getCommands( req.url ); 
	sys.puts( '--- commands: ' + commands );
	if( commands ) {
		var pipeurl = commands[0];
		if( commands.length > 1 ) {
			pipeurl += '&|=';
			for( var i=1; i < commands.length; i++ ) {
				pipeurl += commands[i];
				if( commands[i] < commands.length - 1 ) {
					pipeurl += '|';
				}
			}
		}

		sys.puts( 'opening request to next in pipe: ' + pipeurl );			
		var outrequest = util.postData( pipeurl, pipeDataCallback, pipeEndCallback );
		function pipeDataCallback( data ) {
			res.write( data );
		}
		function pipeEndCallback() {
			res.end();
		}
	}
	else {
		// in the case we don't have any further commands in
		// the pipeline, we loop the command to write back
		sys.puts( 'last node in the pipeline' );
		var outrequest = res;
	}
	
	var route = getRoute( req.url );
	if( route == 'jath' ) {
		doJath();
	}
	// gatekeeping, otherwise could run rm, etc.
	else if( route == 'cat' || route == 'grep' || route == 'wc' ) {
		doUnix();
	}
	else {
		throw "unsupported command";
	}

	function doJath() {
		jathparse.parse( req, outrequest );			
	}

	function doUnix() {
		var cmd = unixcmd.parseUnixUrl( req.url );
		if( cmd.stdin ) {
			sys.puts( 'stdin is from http get' );
			var command = unixcmd.unixCommand( req, outrequest, cmd.name, cmd.args, false );
			unixcmd.getStdinUrl( cmd.stdin, command );
		}
		else {
			sys.puts( 'stdin is from http post' );
			var command = unixcmd.unixCommand( req, outrequest, cmd.name, cmd.args, true );
		}
	}

}).listen( listenport );

function getRoute( url ) {
	var path = require('url').parse( url ).pathname.split('/')[1];
	return path;
}
// return an array of all other commands in the pipeline
function getCommands( url ) {
	var pipe = require('url').parse( url, true ).query['|']
	sys.puts( 'pipeline urls: ' + pipe );
	if( pipe ) {
		return  pipe.split('|');
	}	
	else {
		return null;
	}
}
