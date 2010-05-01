var sys = require('sys');
var util = require( './util' );

/**
* unixcmd.js
*	Module implements unix command runner for webpipes server 
*/
exports.unixCommand = unixCommand;
exports.parseUnixUrl = parseUnixUrl;
exports.getStdinUrl = getStdinUrl;

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
		util.getFileUrl( stdin, dataCallback, endCallback );
	}	
}

// run a unix command
// stdinPost - true if we want to read post data for stdin
function unixCommand( req, res, cmd, cmdargs, stdinPost ) {
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

	if( stdinPost == true ) {
		// write data from http post to stdin 
		// as it appears
		req.addListener( 'data', function( data ){
			sys.puts( 'called data handler '  );
			// sys.puts( data );
			command.stdin.write( data );
		});
		req.addListener( 'end', function() { 
			sys.puts( 'called post stdin end handler '  );
			command.stdin.end();
		});
	}
	return command;
}
