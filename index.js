var fs = require("fs");
var process = require( "process" );
var args = require( "yargs" )
	.usage( "$0 --lint [file]" )
	.demand( "lint" )
	.help()
	.argv;

var package_file_name = args.lint;
var package_file_contents = fs.readFileSync( package_file_name );
var package_file = JSON.parse( package_file_contents );

var failed = [];
Object.keys( package_file.dependencies ).forEach( function( depName ){
	var depValue = package_file.dependencies[ depName ];
	if( depValue.includes( "^" ) ){
		failed.push( depName );
	}
});

if( failed.length > 0 ){
	console.log("The following dependencies are unstable: " + failed.join( ", ") + ".  Please pin these to a specific version." );
	process.exit(-1);
}
