const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const OptimizeCSSAssets = require( 'optimize-css-assets-webpack-plugin' )
const production = 'production' === process.env.NODE_ENV

const alias = {
    lib: path.resolve( __dirname, './src/system/lib/'),
    store: path.resolve( __dirname, './src/system/store'),
    utils: path.resolve( __dirname, './src/system/utils' ),
    config: path.resolve( __dirname, './src/system/config'),
}

const externals = {
    /* WordPress included (hopefully) vendors */
    'react'                         : 'React',
    'react-dom'                     : 'ReactDOM',
    'lodash'                        : 'lodash',
    'react-router-dom'   		    : 'FL.UID.vendors.ReactRouter',
    'redux'              		    : 'FL.UID.vendors.Redux',
    'classnames'         	        : 'FL.UID.vendors.classnames',
    'camelcase'						: 'FL.UID.vendors.camelcase',

    /* FLUID environment */
    'fluid'                         : 'FL.UID',
    'fluid/ui'                      : 'FL.UID.ui',
    'fluid/data'                    : 'FL.UID.data',

    /* wp */
    '@wordpress/i18n'               : 'wp.i18n',
    '@wordpress/keycodes'           : 'wp.keycodes',
    '@wordpress/dom'                : 'wp.dom',
    '@wordpress/element'            : 'wp.element',
    '@wordpress/components'         : 'wp.components',
    '@wordpress/heartbeat'          : 'wp.heartbeat',
    '@wordpress/hooks'              : 'wp.hooks',
    '@wordpress/dom-ready'          : 'wp.domReady',

    /* system bundle */
    'assistant'             		: 'FL.Assistant',
    'assistant/store'       		: 'FL.Assistant.data',
    'assistant/data'        		: 'FL.Assistant.data', // deprecate?
    'assistant/lib'         		: 'FL.Assistant.ui',
    'assistant/ui'          		: 'FL.Assistant.ui', // deprecate?
    'assistant/utils'       		: 'FL.Assistant.utils',

    // I'd be great not to need these
    'assistant/utils/url'   		: 'FL.Assistant.utils.url',
    'assistant/utils/wordpress'   	: 'FL.Assistant.utils.wordpress'
}

const entry = { // if you change a key here, you need to update the enqueue url to match
    ui: './src/ui',
    api: './src/system',
    apps: './src/apps',
    fluid: './src/fluid',
}

const config = {
	entry,
    externals,
	mode: 'development',
    target: 'web',
    watch: true,
    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: `fl-assistant-[name].bundle.js`
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
    config.devtool = 'none'
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
