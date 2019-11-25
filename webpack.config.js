const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const OptimizeCSSAssets = require( 'optimize-css-assets-webpack-plugin' )
const production = 'production' === process.env.NODE_ENV

const alias = {
    ui: path.resolve( __dirname, './src/system/ui/'),
    data: path.resolve( __dirname, './src/system/data'),
    utils: path.resolve( __dirname, './src/system/utils' ),
}

const externals = [
	{
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
        'assistant/data'        		: 'FL.Assistant.data',
        'assistant/ui'          		: 'FL.Assistant.ui',
        'assistant/utils'       		: 'FL.Assistant.utils',
	},
	function( context, request, callback ) {
		/* Nested util imports */
		if ( /assistant\/utils/.test( request ) ){
			const parts = request.split( '/' )
			if ( 3 === parts.length ) {
				return callback( null, 'FL.Assistant.utils.' + parts.pop() )
			}
		}
		callback()
	},
]

const entry = { // if you change a key here, you need to update the enqueue url to match
    render: './src/render',
    system: './src/system',
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
