import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'
import Icon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-manage" */ './app'
) )

registerApp( 'fl-manage', {
	label: __( 'Apps & Settings' ),
	root: App,
	icon: Icon,
	shouldShowInAppList: false,
} )
