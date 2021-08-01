const path = require( 'path' )
const cp = require( 'child_process' )
const os = require( 'os' )

const packages = [
	'@beaverbuilder/app-core',
	'@beaverbuilder/box',
	'@beaverbuilder/cloud',
	'@beaverbuilder/cloud-ui',
	'@beaverbuilder/eslint-config',
	'@beaverbuilder/fluid',
	'@beaverbuilder/fluid-docs',
	'@beaverbuilder/forms',
	'@beaverbuilder/icons',
	'@beaverbuilder/node-system',
	'@beaverbuilder/webpack-config',
]

const cmd = os.platform().startsWith( 'win' ) ? 'npm.cmd' : 'npm'

cp.spawn( cmd, [ 'link', ...packages ], {
	env: process.env,
	cwd: path.join( __dirname, '../' ),
	stdio: 'inherit'
} )
