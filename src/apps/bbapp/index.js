import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud-connect" */ './app'
) )

registerApp( 'bbapp', {
	label: __( 'BB App' ),
	root: App,
	shouldShowInAppList: true,
	state: {
		activeTab: 'libraries'
	}
} )
