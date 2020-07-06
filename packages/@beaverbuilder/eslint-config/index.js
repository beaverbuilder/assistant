module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'wordpress'
	],
	plugins: [
		'react',
		'jsx-a11y'
	],
	settings: {
		react: {
			version: 'detect'
		}
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true
	},
	rules: {
		'camelcase': [
			'off'
		],
		'comma-dangle': [
			'off'
		],
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'space-in-parens': [
			'error',
			'always'
		],
		'object-curly-spacing': [
			'error',
			'always'
		],
		'array-bracket-spacing': [
			'error',
			'always'
		],
		'no-case-declarations': [
			'off'
		],
		'react/prop-types': [
			'off'
		],
		'react/display-name': [
			'off'
		],
		'react/no-unescaped-entities': [
			'off'
		],
		'react/jsx-curly-spacing' : [
			'error',
			'always'
		]
	}
}
