import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils/url'
import { MediaApp } from './app'

registerApp( 'fl-media', {
	label: __( 'Media' ),
	root: MediaApp,
	icon: MediaApp.Icon,
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
