import { registerApp, __ } from 'assistant'
import { Media } from './app'

registerApp( 'fl-media', {
	label: __( 'Media' ),
	root: Media,
	icon: Media.Icon,
	accent: {
		color: '#FF5A5E'
	},
} )
