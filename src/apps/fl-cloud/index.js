import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import cloud from 'assistant/cloud'
import AppIcon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud" */ './app'
) )

if ( ! __PRODUCTION__ ) {
	registerApp( 'fl-cloud', {
		label: __( 'Cloud' ),
		root: App,
		icon: AppIcon,
	} )
}
