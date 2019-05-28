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
    store: path.resolve( __dirname, './src/store'),
    lib: path.resolve( __dirname, './packages/lib/src/' ),
}

const externals = {
    "@wordpress/element" : 'wp.element',
    '@assistant/store' : 'Assistant.store',
}

const entry = {
    'fl-asst-store' : './src/store',
    'fl-asst-ui-test' : './src/ui-test',
    'fl-asst-system' : './src/front',
}

const config = {
	entry: './src',
    externals,
	mode: 'development',
    target: 'web',
    watch: true,
    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: `fl-assistant-[name].bundle.js`,
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
			},
            {
                test: require.resolve('react'),
                use: [{
                    loader: 'expose-loader',
                    options: 'Assistant.vendor.React',
                }]
            },
            {
                test: require.resolve('classnames'),
                use: [{
                    loader: 'expose-loader',
                    options: 'Assistant.vendor.classnames',
                }]
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
