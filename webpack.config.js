const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const OptimizeCSSAssets = require( 'optimize-css-assets-webpack-plugin' )
const production = 'production' === process.env.NODE_ENV

const alias = {
    components: path.resolve( __dirname, './src/front/ui/components' ),
    system: path.resolve( __dirname, './src/front/ui/system' ),
    apps: path.resolve( __dirname, './src/front/apps' ),
    utils: path.resolve( __dirname, './src/utils' ),
	store: path.resolve( __dirname, './src/front/store/' ),
}

const externals = {
    '@assistant' : 'FLAssistant',
    '@assistant/store' : 'FLAssistant.store',
    '@assistant/components' : 'FLAssistant.components',
    '@assistant/utils' : 'FLAssistant.utils',

    /* Vendor Shortcuts */
    '@assistant/react' : 'FLAssistant.vendor.React',
    '@assistant/react-dom' : 'FLAssistant.vendor.ReactDOM',
    '@assistant/classnames' : 'FLAssistant.vendor.classnames',

    "@wordpress/block-editor" : 'wp.blockEditor',
    '@wordpress' : 'wp',
}

const entry = {
    'fl-asst-system' : './src/front',
}

const config = {
	entry,
    externals,
	mode: 'development',
    watch: true,
    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: `[name].bundle.js`,
    },
    resolve: {
        alias,
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
                use: [ 'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
			}
		]
    },
    plugins: [
        new MiniCssExtractPlugin( {
            filename: `[name].bundle.css`,
        } ),
    ]
}

if ( production ) {
	config.mode = 'production'
	config.stats = false
	config.watch = false
	config.plugins.push(
		new OptimizeCSSAssets( {
			cssProcessorOptions: {
				safe: true,
			}
		} ),
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( 'production' ),
		} )
	)
}

module.exports = config
