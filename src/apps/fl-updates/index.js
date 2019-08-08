import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils/url'
import { UpdatesApp } from './app'

registerApp( 'fl-updates', {
	label: __( 'Updates' ),
	root: UpdatesApp,
	icon: UpdatesApp.Icon,
	accent: {
		color: '#00D281'
	},
	search: {
		label: __( 'Updates' ),
		priority: 300,
		route: keyword => {
			return addQueryArgs( 'fl-assistant/v1/updates', {
				search: keyword,
			} )
		},
		format: response => {
			return response.map( result => ( {
				label: result.meta,
			} ) )
		},
	},
} )
