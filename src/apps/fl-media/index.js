import { registerApp, __ } from 'assistant'
import { addQueryArgs } from 'assistant/utils/url'
import { Page } from 'assistant/ui'
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
		route: ( keyword, number, offset ) => {
			return addQueryArgs( 'fl-assistant/v1/attachments', {
				s: keyword,
				posts_per_page: number,
				offset,
			} )
		},
		format: items => {
			return items.map( item => ( {
				...item,
			} ) )
		},
		detail: {
			component: Page.Attachment,
			path: '/attachment/:id',
			pathname: item => {
				return `/attachment/${ item.id }`
			},
		},
	},
} )
