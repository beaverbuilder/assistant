import { registerApp, __ } from 'assistant'
import { Content } from './app'

registerApp( 'fl-content', {
	label: __( 'Content' ),
	root: Content,
	icon: Content.Icon,
	accent: {
		color: '#FF5A5E'
	},
} )
