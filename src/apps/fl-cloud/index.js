import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import cloud from 'assistant/utils/cloud'
import AppIcon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud" */ './app'
) )

if ( ! __PRODUCTION__ ) {

	cloud.auth.checkAccess()

	registerApp( 'fl-cloud', {
		label: __( 'Cloud' ),
		root: App,
		icon: AppIcon,
	} )
}
