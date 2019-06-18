import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'
import { App, AppIcon } from './app'

registerApp( 'fl-example-unsplash', {
	label: __( 'Unsplash' ),
	root: App,
	icon: AppIcon,
	accent: {
		color: '#50E3C2',
	},
} )
