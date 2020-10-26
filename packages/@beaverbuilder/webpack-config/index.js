const webpack = require( 'webpack' )
const { merge } = require( 'webpack-merge' )
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' )
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin
const isProduction = 'production' === process.env.NODE_ENV
const isAnalyzing = 'analyze' === process.env.NODE_ENV

const commonWebpackConfig = options => {

	const common = {
		mode: 'development',
		target: 'web',
		watch: true,
		devtool: 'source-map',
		plugins: [
			new CleanWebpackPlugin(),
			new webpack.DefinePlugin( {
				__PRODUCTION__: isProduction,
			} ),
		],
	}

	const config = merge( options, common )

	if ( isAnalyzing ) {
		config.devtool = false
		config.plugins.push(
			new BundleAnalyzerPlugin()
		)
	}

	if ( isProduction ) {
		config.mode = 'production'
		config.stats = false
		config.watch = false
		config.devtool = false
		config.plugins.push(
			new webpack.DefinePlugin( {
				'process.env.NODE_ENV': JSON.stringify( 'production' ),
			} ),
		)
	}

	return config
}

module.exports = commonWebpackConfig
