import babel from 'rollup-plugin-babel'
import external from 'rollup-plugin-peer-deps-external'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import url from 'rollup-plugin-url'
import pkg from './package.json'
import visualizer from 'rollup-plugin-visualizer'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import cleaner from 'rollup-plugin-cleaner'

const { IS_PRODUCTION } = process.env

export default {
	input: 'src/index.js',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: ! IS_PRODUCTION
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: ! IS_PRODUCTION
		}
	],
	plugins: [
		external(),
		postcss( {
			extract: true
		} ),
		url(),
		babel( {
			exclude: 'node_modules/**',
		} ),
		commonjs( {
			include: 'node_modules/**',
			namedExports: {
				'node_modules/react-is/index.js': [ 'isValidElementType' ]
			}
		} ),
		visualizer(),
		resolve( {
			jsnext: true,
			preferBuiltins: true,
			browser: true
		} ),
		json(),
		cleaner( {
			targets: [ './dist/' ]
		} )
	]
}
