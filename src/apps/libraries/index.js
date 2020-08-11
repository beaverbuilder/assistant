import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'
import AppIcon from './icon'
import { state, actions, reducers, loadLibraries } from './data'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud-libraries" */ './app'
) )

if ( ! __PRODUCTION__ ) {
	registerApp( 'libraries', {
		label: __( 'Libraries' ),
		root: App,
		icon: AppIcon,
		onMount: loadLibraries,
		state,
		actions,
		reducers
	} )
}
