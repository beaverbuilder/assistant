const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' )
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' )
const sharedConfig = require( '@beaverbuilder/webpack-config' )
const isProduction = 'production' === process.env.NODE_ENV
const includePro = 'true' === process.env.INCLUDE_PRO

const alias = {
	ui: path.resolve( __dirname, './src/system/ui/' ),
	data: path.resolve( __dirname, './src/system/data' ),
	utils: path.resolve( __dirname, './src/system/utils' ),
	cloud: path.resolve( __dirname, './src/system/cloud' ),
	home: path.resolve( __dirname, './src/apps/fl-home' ),

	// These allow the fluid/vendors bundle to address these directly without getting caught by externals
	'vendor-react-router-dom': path.resolve( __dirname, './node_modules/react-router-dom/' ),
	'vendor-classnames': path.resolve( __dirname, './node_modules/classnames/' ),
	'vendor-framer-motion': path.resolve( __dirname, './node_modules/framer-motion/' ),
	'vendor-react-laag': path.resolve( __dirname, './node_modules/react-laag/' ),
	'vendor-redux': path.resolve( __dirname, './node_modules/redux/' ),
	'vendor-html2canvas': path.resolve( __dirname, './node_modules/html2canvas/' ),

	// Our @beaverbuilder/ packages
	'vendor-app-core': path.resolve( __dirname, './node_modules/@beaverbuilder/app-core' ),
	'vendor-forms': path.resolve( __dirname, './node_modules/@beaverbuilder/forms' ),
	'vendor-fluid': path.resolve( __dirname, './node_modules/@beaverbuilder/fluid' ),
	'vendor-cloud': path.resolve( __dirname, './node_modules/@beaverbuilder/cloud' ),
	'vendor-icons': path.resolve( __dirname, './node_modules/@beaverbuilder/icons' ),
}

/**
 * Externals simply declare where a certain module is going to be access from on the DOM.
 * This ensures that, in the event that this package is included, there is only one copy on the page.
 */
const externals = [
	{
		'react': 'React',
		'react-dom': 'ReactDOM',
		'lodash': 'lodash',
		'react-router-dom': 'ReactRouterDOM',
		'classnames': 'classnames',
		'framer-motion': 'FramerMotion',
		'react-laag': 'ReactLaag',
		'redux': 'Redux',
		'html2canvas': 'HTML2Canvas',

		// Our own packages provided as vendors
		'@beaverbuilder/app-core': 'FL.vendors.BBAppCore',
		'@beaverbuilder/forms': 'FL.vendors.BBForms',
		'@beaverbuilder/fluid': 'FL.vendors.BBFluid',
		'@beaverbuilder/cloud': 'FL.vendors.BBCloud',
		'@beaverbuilder/icons': 'FL.vendors.BBIcons',

		/* system bundle */
		'assistant': 'FL.Assistant',
		'assistant/data': 'FL.Assistant.data',
		'assistant/ui': 'FL.Assistant.ui',
		'assistant/utils': 'FL.Assistant.utils',
		'assistant/cloud': 'FL.Assistant.cloud',
	},
	function( { request }, callback ) {

		/* Nested util imports */
		if ( /assistant\/utils/.test( request ) ) {
			const parts = request.split( '/' )
			if ( 3 === parts.length ) {
				return callback( null, 'FL.Assistant.utils.' + parts.pop() )
			}
		}
		callback()
	},
]

// Vendor entry points
const vendors = {
	'vendor-classnames': './src/vendors/classnames',
	'vendor-redux': './src/vendors/redux',
	'vendor-react-router-dom': './src/vendors/react-router-dom',
	'vendor-framer-motion': './src/vendors/framer-motion',
	'vendor-react-laag': './src/vendors/react-laag',
	'vendor-html2canvas': './src/vendors/html2canvas',
	'vendor-bb-cloud': './src/vendors/bb-cloud',
	'vendor-bb-forms': './src/vendors/bb-forms',
	'vendor-bb-app-core': './src/vendors/bb-app-core',
	'vendor-bb-fluid': './src/vendors/bb-fluid',
	'vendor-bb-icons': './src/vendors/bb-icons',
}

const config = {
	entry: { // if you change a key here, you need to update the enqueue url to match
		...vendors,
		system: './src/system',
		render: './src/render',
		apps: './src/apps',
	},
	externals,
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: '[name].js?var=[contenthash]',
		chunkFilename: 'chunk-[name].js?var=[contenthash]',
		publicPath: '',
	},
	resolve: {
		alias,
		modules: [ 'node_modules' ],
		symlinks: false
	},
	snapshot: {

		// Without this linked packages won't be watched.
		// https://github.com/webpack/webpack/issues/11612
		managedPaths: []
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ 'babel-loader' ],
			},
			{
				test: /\.s?css$/,
				use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin( {
			filename: '[name].css?var=[contenthash]',
		} ),
		new webpack.DefinePlugin( {
			'__INCLUDE_PRO__': includePro,
		} )
	]
}

if ( isProduction ) {
	config.optimization = {
		minimize: true,
		minimizer: [ new CssMinimizerPlugin() ]
	}
}

/* Look at @beaverbuilder/webpack-common for additional config.
* - production setup
* - analyzing setup
*/

module.exports = sharedConfig( config )
