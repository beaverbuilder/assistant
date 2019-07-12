import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils/url'
import { Content } from './app'

registerApp( 'fl-content', {
	label: __( 'Content' ),
	root: Content,
	search: {
		label: __( 'Content' ),
		priority: 1,
		route: keyword => {
			return addQueryArgs( 'fl-assistant/v1/posts', {
				post_type: 'any',
				s: keyword,
			} )
		},
	},
} )
