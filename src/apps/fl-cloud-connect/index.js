import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import AppIcon from './icon'
import onMount from './mount'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud-connect" */ './app'
) )

if ( ! __PRODUCTION__ ) {
	registerApp( 'fl-cloud-connect', {
		label: __( 'Cloud Connect' ),
		root: App,
		icon: AppIcon,
		shouldShowInAppList: false,
		state: {
			isValidating: false
		},
		onMount
	} )
}
