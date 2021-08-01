const path = require( 'path' )
const fs = require( 'fs' )
const cp = require( 'child_process' )
const os = require( 'os' )

const packagePath = path.join( __dirname, '../node_modules/@beaverbuilder' )
const packages = fs.readdirSync( packagePath, { withFileTypes: true } )
	.filter( file => file.isDirectory() )
	.map( file => `@beaverbuilder/${ file.name }` )

const cmd = os.platform().startsWith( 'win' ) ? 'npm.cmd' : 'npm'
cp.spawn( cmd, [ 'link', ...packages ], {
	env: process.env,
	cwd: path.join( __dirname, '../' ),
	stdio: 'inherit'
} )
