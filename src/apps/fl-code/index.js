import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import Icon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-content" */ './app'
) )

export const defaultState = {
	listStyle: '',
	query: {
		order: 'DESC',
		orderby: 'ID',
		post_status: 'any',
		post_type: 'fl_code',
		label: '0',
	}
}

export const cache = [ 'listStyle', 'query' ]

registerApp( 'fl-code', {
	label: __( 'Code' ),
	root: App,
	icon: Icon,
	state: { ...defaultState },
	cache
} )
