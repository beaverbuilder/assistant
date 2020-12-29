const webpack = require( 'webpack' )
const { merge } = require( 'webpack-merge' )
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin
const TerserPlugin = require( 'terser-webpack-plugin' )
const isProduction = 'production' === process.env.NODE_ENV
const isAnalyzing = 'analyze' === process.env.NODE_ENV

// @wordpress packages exposed via externals
const wpExternals = {
	'@wordpress/i18n': 'wp.i18n',
	'@wordpress/keycodes': 'wp.keycodes',
	'@wordpress/dom': 'wp.dom',
	'@wordpress/element': 'wp.element',
	'@wordpress/components': 'wp.components',
	'@wordpress/heartbeat': 'wp.heartbeat',
	'@wordpress/hooks': 'wp.hooks',
	'@wordpress/dom-ready': 'wp.domReady',
	'@wordpress/date': 'wp.date',
}

const sharedWebpackConfig = projectConfig => {

	const config = {
		target: 'web',
		mode: isProduction ? 'production' : 'development',
		stats: ! isProduction,
		watch: ! isProduction,
		devtool: ! isProduction && ! isAnalyzing ? 'cheap-module-source-map' : false,
		externals: [ wpExternals ],
		plugins: [
			new webpack.DefinePlugin( {
				__PRODUCTION__: isProduction,
			} )
		],
		optimization: {
			minimize: isProduction,
			minimizer: []
		},
	}

	if ( isAnalyzing ) {
		config.plugins.push(
			new BundleAnalyzerPlugin()
		)
	}

	if ( isProduction ) {
		config.plugins.push(
			new webpack.DefinePlugin( {
				'process.env.NODE_ENV': JSON.stringify( 'production' ),
			} )
		)
		config.optimization.minimize = true
		config.optimization.minimizer.push( new TerserPlugin() )
	}

	return merge( config, projectConfig )
}

module.exports = sharedWebpackConfig
