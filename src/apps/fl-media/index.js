import { registerApp, __ } from 'assistant'
import { AppIcon } from './app'

registerApp( 'fl-media', {
	label: __( 'Media' ),
	icon: AppIcon,
	accent: {
		color: '#FF5A5E'
	},
} )
