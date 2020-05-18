import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'
import { Page } from 'assistant/ui'
import { addQueryArgs } from 'assistant/utils/url'
import { currentUserCan } from 'assistant/utils/wordpress'
import Icon from './icon'
import { defaultState } from './data'

const CommentsApp = lazy( () => import(
	/* webpackChunkName: "app-comments" */ './app'
) )

const label = __( 'Comments' )

registerApp( 'fl-comments', {
	label,
	root: CommentsApp,
	icon: Icon,
	enabled: currentUserCan( 'moderate_comments' ),
	state: defaultState,
	search: {
		label,
		priority: 300,
		route: ( keyword, number, offset ) => {
			return addQueryArgs( 'fl-assistant/v1/comments', {
				search: keyword,
				number,
				offset,
			} )
		},
		format: items => items.map( item => ( {
			...item,
			label: item.meta,
		} ) ),
		detail: {
			component: Page.Comment,
			path: '/comment/:id',
			pathname: item => `/comment/${ item.id }`
		},
	},
} )
