import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App } from './app'

registerApp( 'fl-ui-examples', {
	label: __( 'Examples' ),
	root: App,
	icon: App.Icon,
	accent: { color: '#8bc34a' }
} )
