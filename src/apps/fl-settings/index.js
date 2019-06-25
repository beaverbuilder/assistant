import { registerApp, __ } from 'assistant'
import { App, AppIcon } from './app'

registerApp( 'fl-settings', {
	label: __( 'Preferences' ),
	root: App,
	icon: AppIcon,
	accent: {
		color: '#4748ff',
	}
} )
