/** 
* commandline interface to webpipes
* usage: % wp <cmd> <url>
* local files are not supported yet
*/
var util = require( './util' );
var sys = require( 'sys' );
exports.exec = exec;

function exec( args ) {
	sys.puts( 'arguments: ' + args.join( ' ' ) );	
	var request = util.postData( args[2], dataCallback, endCallback );
	var stdin = process.openStdin();
	stdin.addListener( 'data', function( data ) {
		request.write( data );
	});
	stdin.addListener( 'end', function() {
		request.end();
	});
}

function dataCallback( data ) {
	// TODO: better to explicitly open stdout?
	sys.puts( data );
}
function endCallback() {}

function processArgs( args ) {
}
