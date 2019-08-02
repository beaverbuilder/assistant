import { registerApp, __ } from 'assistant'
import { App, AppIcon } from './app'

registerApp( 'fl-viewing', {
	label: __( 'Viewing' ),
	root: App,
	icon: AppIcon,
	accent: {
		color: '#1BADF8',
	}
} )
