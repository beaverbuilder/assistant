import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils/url'
import { CommentsApp } from './app'

registerApp( 'fl-alerts', {
	label: __( 'Comments' ),
	root: CommentsApp,
	search: {
		label: __( 'Comments' ),
		priority: 300,
		route: keyword => {
			return addQueryArgs( 'fl-assistant/v1/comments', {
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
