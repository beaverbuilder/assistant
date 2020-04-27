import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import Icon from './icon'

const App = lazy( () => import(
    /* webpackChunkName: "app-search" */ "./app"
) )

registerApp( 'fl-search', {
	label: __( 'Search' ),
	root: App,
	icon: Icon,
	state: {
		keyword: ''
	},
} )
