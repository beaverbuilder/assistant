import {registerApp, __} from 'assistant'
import {addQueryArgs} from 'assistant/utils/url'
import {Content} from './app'

registerApp( 'fl-content', {
	label: __( 'Content' ),
	root: Content,
	accent: {
		color: '#1BADF8'
	},
	state: {
		query: {
			order: 'ASC',
			orderby: 'title',
			post_status: 'any',
			post_type: 'post',
		},
		pager: {
			data: [],
			current_page: 0,
			first_page: 1,
			has_more: true,
			last_page: 2,
			offset: 0,
			per_page: 20,
			total: 21
		}
	},
	search: {
		label: __( 'Content' ),
		priority: 1,
		route: keyword => {
			return addQueryArgs( 'fl-assistant/v1/posts', {
				post_type: 'any',
				s: keyword,
			} )
		},
	}
} )
