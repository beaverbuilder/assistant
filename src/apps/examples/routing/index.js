import { registerApp, __ } from 'assistant'
import { App, AppIcon } from './app'

registerApp( 'fl-example-routing', {
	label: __( 'Routing Example' ),
	root: App,
	icon: AppIcon,
	accent: {
		color: '#00A681',
	},
} )
