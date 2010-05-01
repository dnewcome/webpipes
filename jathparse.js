/**
* webpipes command to scrape data with jath
*/
var xml = require( 'libxmljs' );
var jath = require( './lib/jath' );
var util = require( './util' );
var sys = require( 'sys' );

exports.parse = parse;

function parse(req, res) {
	var sourcedata = "";
	var templatedata = "";
	var postdone = false;
	var getdone = false;
	var lock = false;

	// get source data url
	sys.puts( 'url is : ' + req.url );	
	var srcurl = require( 'url' ).parse( req.url, true ).query.src;

	// get the source data
	function dataCallback( data ) {
		sourcedata += data;
		sys.puts( 'data callback. sourcedata: ' + sourcedata );
	}

	function endCallback() {
		getdone = true;
		if( postdone && !lock ) {
			lock = true;
			jathTransform();
		}
	}
	util.getFileUrl( srcurl, dataCallback, endCallback );


	// collect post data 
	req.addListener( 'data', function( data ){
		sys.puts( 'called post data handler ' );
		templatedata += data;
	});

	req.addListener( 'end', function() {
		postdone = true;
		if( getdone && !lock ) {
			lock = true;
			jathTransform();
		}	
	});
	
	function jathTransform() {
		sys.puts( 'running jath transform' );
		sys.puts( 'sourcedata ' + sourcedata );
		sys.puts( 'templatedata ' + templatedata );
		var xmldoc = xml.parseXmlString( sourcedata );
		var template = eval( templatedata );
		var result = jath.parse( template, xmldoc );
		sys.puts( sys.inspect(result, false, null ) );
		res.write( sys.inspect(result, false, null ) );
		res.end();
	}
}
