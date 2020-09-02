import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'
import AppIcon from './icon'

const App = lazy( () => import(
	/* webpackChunkName: "app-cloud-connect" */ './app'
) )

registerApp( 'fl-cloud-connect', {
	label: __( 'Cloud Connect' ),
	root: App,
	icon: AppIcon,
	shouldShowInAppList: false,
} )
