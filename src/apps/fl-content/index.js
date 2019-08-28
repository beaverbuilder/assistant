import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from 'assistant/utils/url'
import { getSystemConfig } from 'assistant/data'
import { Page } from 'assistant/ui'
import { Content } from './app'

const { contentTypes, taxonomies } = getSystemConfig()

registerApp( 'fl-content', {
	label: __( 'Content' ),
	root: Content,
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
	search: Object.entries( contentTypes ).map( ( [ type, data ], key ) => {
		return {
			label: data.labels.plural,
			priority: key,
			route: ( keyword, number, offset ) => {
				return addQueryArgs( 'fl-assistant/v1/posts', {
					post_type: type,
					s: keyword,
					posts_per_page: number,
					offset,
				} )
			},
			detail: {
				component: Page.Post,
				path: '/post/:id',
				pathname: item => {
					return `/post/${ item.id }`
				},
			},
		}
	} ).concat( Object.entries( taxonomies ).map( ( [ type, data ], key ) => {
		return {
			label: data.labels.plural,
			priority: Object.entries( contentTypes ).length + key,
			route: ( keyword, number, offset ) => {
				return addQueryArgs( 'fl-assistant/v1/terms', {
					taxonomy: type,
					hide_empty: 0,
					search: keyword,
					number,
					offset,
				} )
			},
			detail: {
				component: Page.Term,
				path: '/term/:id',
				pathname: item => {
					return `/term/${ item.id }`
				},
			},
		}
	} ) )
} )
