import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils'
import { Media } from './app'

registerApp( 'fl-media', {
	label: __( 'Media' ),
	root: Media,
	icon: Media.Icon,
	accent: {
		color: '#FF5A5E'
	},
	search: {
		label: __( 'Media' ),
		priority: 100,
		route: keyword => {
			return addQueryArgs( 'fl-assistant/v1/attachments', {
				s: keyword,
			} )
		},
	},
} )
