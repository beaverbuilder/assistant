import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { StyleApp } from './app'

registerApp( 'fl-style', {
	label: __( 'Style' ),
	root: StyleApp,
} )
