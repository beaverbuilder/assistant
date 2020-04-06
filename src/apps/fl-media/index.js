import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from 'assistant/utils/url'
import { Page } from 'assistant/ui'
import { MediaApp } from './app'
import Icon from './icon'

export const defaultState = {
	listStyle: 'grid',
	query: {
		post_mime_type: 'all',
		order: 'DESC',
		orderby: 'date',
		label: 0,
	}
}

registerApp( 'fl-media', {
	label: __( 'Media' ),
	root: MediaApp,
	icon: Icon,
	accent: {
		color: '#FF5A5E'
	},
	state: {
		...defaultState,
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
