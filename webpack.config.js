const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const OptimizeCSSAssets = require( 'optimize-css-assets-webpack-plugin' )
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin
const production = 'production' === process.env.NODE_ENV
const isAnalyzing = 'analyze' === process.env.NODE_ENV

const alias = {
	ui: path.resolve( __dirname, './src/system/ui/' ),
	data: path.resolve( __dirname, './src/system/data' ),
	utils: path.resolve( __dirname, './src/system/utils' ),
	hooks: path.resolve( __dirname, './src/system/hooks' ),
	cloud: path.resolve( __dirname, './src/system/cloud' ),

	'home': path.resolve( __dirname, './src/apps/fl-home' ),
	'home/ui': path.resolve( __dirname, './src/apps/fl-home/ui' ),
	'home/data': path.resolve( __dirname, './src/apps/fl-home/data' ),

	// These allow the fluid/vendors bundle to address these directly without getting caught by externals
	'vendor-react-router-dom': path.resolve( __dirname, './node_modules/react-router-dom/' ),
	'vendor-classnames': path.resolve( __dirname, './node_modules/classnames/' ),
	'vendor-framer-motion': path.resolve( __dirname, './node_modules/framer-motion/' ),
	'vendor-react-laag': path.resolve( __dirname, './node_modules/react-laag/' ),
	'vendor-resize-observer-polyfill': path.resolve( __dirname, './node_modules/resize-observer-polyfill/' ),
	'vendor-redux': path.resolve( __dirname, './node_modules/redux/' ),

	// Our @beaverbuilder/ packages
	'vendor-app-core': path.resolve( __dirname, './node_modules/@beaverbuilder/app-core' ),
	'vendor-forms': path.resolve( __dirname, './node_modules/@beaverbuilder/forms' ),
	'vendor-fluid': path.resolve( __dirname, './node_modules/@beaverbuilder/fluid' ),
	'vendor-cloud': path.resolve( __dirname, './node_modules/@beaverbuilder/cloud' ),
}

const externals = [
	{

		// Vendors provided by WordPress
		'react': 'React',
		'react-dom': 'ReactDOM',
		'lodash': 'lodash',

		// Vendors set up by local fluid bundle
		'react-router-dom': 'FL.vendors.ReactRouter',
		'classnames': 'FL.vendors.classnames',
		'framer-motion': 'FL.vendors.FramerMotion',
		'react-laag': 'FL.vendors.ReactLaag',
		'resize-observer-polyfill': 'FL.vendors.ResizeObserver',
		'redux': 'FL.vendors.Redux',
		'@beaverbuilder/app-core': 'FL.vendors.BBAppCore',
		'@beaverbuilder/forms': 'FL.vendors.BBForms',
		'@beaverbuilder/fluid': 'FL.vendors.BBFluid',
		'@beaverbuilder/cloud': 'FL.vendors.BBCloud',

		/* wp */
		'@wordpress/i18n': 'wp.i18n',
		'@wordpress/keycodes': 'wp.keycodes',
		'@wordpress/dom': 'wp.dom',
		'@wordpress/element': 'wp.element',
		'@wordpress/components': 'wp.components',
		'@wordpress/heartbeat': 'wp.heartbeat',
		'@wordpress/hooks': 'wp.hooks',
		'@wordpress/dom-ready': 'wp.domReady',
		'@wordpress/date': 'wp.date',

		/* system bundle */
		'assistant': 'FL.Assistant',
		'assistant/data': 'FL.Assistant.data',
		'assistant/ui': 'FL.Assistant.ui',
		'assistant/utils': 'FL.Assistant.utils',
		'assistant/hooks': 'FL.Assistant.hooks',
		'assistant/cloud': 'FL.Assistant.cloud',
	},
	function( context, request, callback ) {

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

const entry = { // if you change a key here, you need to update the enqueue url to match
	vendors: './src/vendors',
	system: './src/system',
	render: './src/render',
	apps: './src/apps',
}

const config = {
	entry,
	externals,
	mode: 'development',
	target: 'web',
	watch: true,
	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: 'fl-assistant-[name].bundle.js',
		chunkFilename: 'fl-chunk-[name].js'
	},
	resolve: { alias },
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ 'babel-loader' ],
			},
			{
				test: /\.s?css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							sourceMap: production ? false : true
						}
					},
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: production ? false : true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: production ? false : true
						}
					},
				],
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin( {
			filename: 'fl-assistant-[name].bundle.css',
		} ),
		new webpack.DefinePlugin( {
			__PRODUCTION__: production,
		} ),
	]
}

if ( isAnalyzing ) {
	config.plugins.push(
		new BundleAnalyzerPlugin()
	)
}

if ( production ) {
	config.mode = 'production'
	config.stats = false
	config.watch = false
	config.devtool = false
	config.plugins.push(
		new OptimizeCSSAssets( {
			cssProcessorOptions: {
				safe: true,
			}
		} ),
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( 'production' ),
		} ),
	)
}

module.exports = config
