import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from 'assistant/utils/url'
import { getSystemConfig } from 'assistant/data'
import { Page } from 'assistant/ui'
import { Content } from './app'
import Icon from './icon'

const { contentTypes, taxonomies } = getSystemConfig()

export const defaultState = {
	listStyle: '',
	query: {
		order: 'DESC',
		orderby: 'ID',
		post_status: 'any',
		post_type: 'post',
	}
}

registerApp( 'fl-content', {
	label: __( 'Content' ),
	root: Content,
	icon: Icon,
	accent: {
		color: '#006AD4'
	},
	state: { ...defaultState },
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
