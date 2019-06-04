const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const OptimizeCSSAssets = require( 'optimize-css-assets-webpack-plugin' )
const production = 'production' === process.env.NODE_ENV

const alias = {

    components: path.resolve( __dirname, './src/_original/original-ui/ui/components' ),
    system: path.resolve( __dirname, './src/_original/original-ui/ui/system' ),

    store: path.resolve( __dirname, './src/system/store'),
    utils: path.resolve( __dirname, './packages/utils/src/' ),
    lib: path.resolve( __dirname, './packages/lib/src/' ),
}

const externals = {
    'fl-react'          : 'FL.React',
    'fl-react-dom'      : 'FL.ReactDOM',

    'assistant'         : 'FL.Assistant',
    'assistant/store'   : 'FL.Assistant.store',
    'assistant/lib'     : 'FL.Assistant.lib',
    'assistant/utils'     : 'FL.Assistant.utils',
}

const entry = {
    main: './src/ui',
    api: './src/system',
    apps: './src/apps',
    vendors: './src/fl-vendors',
}

const config = {
	entry,
    externals,
	mode: 'development',
    target: 'web',
    watch: true,
    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: `fl-assistant-[name].bundle.js`,
    },
    resolve: { alias },
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
			},
		]
    },
    plugins: [
        new MiniCssExtractPlugin( {
            filename: `fl-assistant-[name].bundle.css`,
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
