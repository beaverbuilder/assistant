import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App } from './app'

registerApp( 'fl-labels', {
	label: __( 'Labels' ),
	root: App,
} )
