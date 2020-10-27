const webpack = require( 'webpack' )
const { merge } = require( 'webpack-merge' )
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' )
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin
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
			new CleanWebpackPlugin(),
			new webpack.DefinePlugin( {
				__PRODUCTION__: isProduction,
			} )
		],
		optimization: {
			minimize: isProduction
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
	}

	const merged = merge( config, projectConfig )

	return merged
}

module.exports = sharedWebpackConfig
