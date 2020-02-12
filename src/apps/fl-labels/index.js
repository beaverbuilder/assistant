import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { App, Icon } from './app'

registerApp( 'fl-labels', {
	label: __( 'Labels' ),
	root: App,
	icon: App.Icon,
} )
