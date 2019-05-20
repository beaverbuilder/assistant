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

    lib: path.resolve( __dirname, './packages/lib/src/' ),
}

const externals = {

    '@assistant' : 'UNSTABLE_FLAssistant',
    '@assistant/store' : 'UNSTABLE_FLAssistant.store',
    '@assistant/components' : 'UNSTABLE_FLAssistant.components',
    '@assistant/utils' : 'UNSTABLE_FLAssistant.utils',

    /* Vendor Shortcuts */
    '@assistant/react' : 'UNSTABLE_FLAssistant.vendor.React',
    '@assistant/react-dom' : 'UNSTABLE_FLAssistant.vendor.ReactDOM',
    '@assistant/redux' : 'UNSTABLE_FLAssistant.vendor.redux',
    '@assistant/react-redux' : 'UNSTABLE_FLAssistant.vendor.reactRedux',
    '@assistant/classnames' : 'UNSTABLE_FLAssistant.vendor.classnames',
    '@assistant/react-tunnels' : 'UNSTABLE_FLAssistant.vendor.tunnels',

    "@wordpress/block-editor" : 'wp.blockEditor',
    '@wordpress' : 'wp',
}

const entry = {
    'fl-asst-ui-test' : './src/ui-test',
    'fl-asst-system' : './src/front',
}

const config = {
	entry,
    externals,
	mode: 'development',
    target: 'web',
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
