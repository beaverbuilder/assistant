const webpack = require('webpack')
const path = require('path')

const config = {
    devtool: 'none',
    mode: 'development',
    watch: true,
    entry: './src/index.js',
    output: {
        devtoolNamespace: 'fl',
        path: path.resolve(__dirname, 'dist'),
        filename: 'fluid.js',
        library: ['FL', 'UID'],
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    resolve: {
        alias: {
            ui: path.resolve(__dirname, './src/ui'),
            store: path.resolve(__dirname, './src/store'),
        }
    },
    externals: {
        'react'            : 'React',
    	'react-dom'        : 'ReactDOM',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ],
            },
        ]
    },
    plugins: [],
}

if ( 'production' === process.env.NODE_ENV ) {
	config.mode = 'production'
	config.stats = false
	config.watch = false
	config.plugins.push(
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( 'production' ),
		} )
	)
}

module.exports = config
