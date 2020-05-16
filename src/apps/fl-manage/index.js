import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'

const App = lazy( () => import(
	/* webpackChunkName: "app-manage" */ './app'
) )

registerApp( 'fl-manage', {
	label: __( 'Apps & Settings' ),
	root: App,
	shouldShowInAppList: false,
} )
