const webpack = require( 'webpack' )
const path = require( 'path' )
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const production = process.env.NODE_ENV === 'production' ? '.min' : ''

const alias = {
    ui: path.resolve( __dirname, './src/front/ui/'),
    components: path.resolve( __dirname, './src/front/ui/components'),
    apps: path.resolve( __dirname, './src/front/apps'),
    utils: path.resolve( __dirname, './src/utils'),
	store: path.resolve( __dirname, './src/front/store/'),
}
const entry = {
    front: './src/front/index.js',
    utils: './src/utils/index.js'
}

module.exports = {
    watch: true,
    mode: 'development',
    entry,
    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: '[name].bundle' + production + '.js',
    },
    resolve: {
        alias
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ]
            },
            {
                test: /\.s?css$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			}
		]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].bundle.css',
        }),
    ]
}
