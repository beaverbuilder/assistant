import { registerApp, __ } from 'assistant'
import { AppIcon } from './app'

registerApp( 'fl-media', {
	label: __( 'Media' ),
	icon: AppIcon,
	accentColor: {
		color: '#FF5A5E'
	},
} )
