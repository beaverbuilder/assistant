import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from 'assistant/utils/url'
import { Page } from 'assistant/ui'
import { CommentsApp } from './app'

registerApp( 'fl-comments', {
	label: __( 'Comments' ),
	root: CommentsApp,
	icon: CommentsApp.Icon,
	accent: {
		color: '#FFCC00'
	},
	search: {
		label: __( 'Comments' ),
		priority: 300,
		route: ( keyword, number, offset ) => {
			return addQueryArgs( 'fl-assistant/v1/comments', {
				search: keyword,
				number,
				offset,
			} )
		},
		format: items => {
			return items.map( item => ( {
				...item,
				label: item.meta,
			} ) )
		},
		detail: {
			component: Page.Comment,
			path: '/comment/:id',
			pathname: item => {
				return `/comment/${ item.id }`
			},
		},
	},
} )
