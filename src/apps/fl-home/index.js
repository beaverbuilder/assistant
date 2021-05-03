import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import Icon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-home" */ './app'
) )

registerApp( 'fl-home', {
	label: __( 'Home' ),
	root: App,
	icon: Icon,
	shouldShowInAppList: false,
	state: {
		keyword: '',
		collapsedSections: [],
	},
	cache: [ 'collapsedSections' ]
} )
