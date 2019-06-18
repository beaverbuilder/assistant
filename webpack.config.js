const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const OptimizeCSSAssets = require( 'optimize-css-assets-webpack-plugin' )
const production = 'production' === process.env.NODE_ENV

const alias = {

    // Deprecated
    components: path.resolve( __dirname, './src/_original/original-ui/ui/components' ),
    system: path.resolve( __dirname, './src/_original/original-ui/ui/system' ),

    // New UI
    lib: path.resolve( __dirname, './src/system/lib/'),
    store: path.resolve( __dirname, './src/system/store'),
    utils: path.resolve( __dirname, './packages/utils/src/' ),
    'shared-lib': path.resolve( __dirname, './packages/shared-lib/src/' ),
}

const externals = {

    /* fl-vendor */
    'fl-react'              : 'FL.React',
    'fl-react-dom'          : 'FL.ReactDOM',
    'fl-react-router-dom'   : 'FL.ReactRouter',

    /* system bundle */
    'assistant'             : 'FL.Assistant',
    'assistant/store'       : 'FL.Assistant.store',
    'assistant/lib'         : 'FL.Assistant.lib',
    'assistant/i18n'        : 'FL.Assistant.i18n',
    'assistant/http'        : 'FL.Assistant.http',

    /* wp */
    '@wordpress/i18n'       : 'wp.i18n',
}

const entry = {
    ui: './src/ui',
    api: './src/system',
    apps: './src/apps',
    vendors: './packages/fl-vendors',
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
    devtool: production ? '' : 'source-map',
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
                            sourceMap: true
                        }
                    },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ],
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
