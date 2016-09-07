#! /usr/bin/env node
var fs = require("fs");
var process = require( "process" );

function verify_dependency_pinned( dictionary, name ) {
	var pinned = true;
	if( dictionary[name].includes( "^" ) ){
		pinned = false;
	}
	return pinned;
}

function verify_dependency_dictionary( dictionary ){
	dictionary = dictionary || {};
	var failed = [];
	var names = Object.keys( dictionary );
	names.forEach( function( name ){
		if( !verify_dependency_pinned ){
			failed.push( name );
		}
	});
	return failed;
}

var args = require( "yargs" )
	.usage( "$0 --lint [file]" )
	.demand( "lint" )
	.help()
	.argv;

var package_file_name = args.lint;
var package_file_contents = fs.readFileSync( package_file_name );
var package_file = JSON.parse( package_file_contents );

var failedRuntimeDependencies = verify_dependency_dictionary( package_file.dependencies );
var failedDevDependencies = verify_dependency_dictionary( package_file.devDependencies );
var failed = [].concat( failedRuntimeDependencies ).concat( failedDevDependencies );

if( failed.length > 0 ){
	console.log("The following dependencies are unstable: " + failed.join( ", ") + ".  Please pin these to a specific version." );
	process.exit(-1);
}
