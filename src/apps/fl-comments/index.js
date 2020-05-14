import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from 'assistant/utils/url'
import { currentUserCan } from 'assistant/utils/wordpress'
import { Comment } from './pages'
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
		format: items => {
			return items.map( item => ( {
				...item,
				label: item.meta,
			} ) )
		},
		detail: {
			component: Comment,
			path: '/comment/:id',
			pathname: item => `/comment/${ item.id }`
		},
	},
} )
