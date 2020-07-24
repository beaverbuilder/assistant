import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import AppIcon from './icon'
import { state, onMount } from './data'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud-libraries" */ './app'
) )

if ( ! __PRODUCTION__ ) {
	registerApp( 'fl-cloud-libraries', {
		label: __( 'Libraries' ),
		root: App,
		icon: AppIcon,
		state,
		onMount
	} )
}
