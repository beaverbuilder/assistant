import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'

// Register the default card types
import './types'

const App = lazy( () => import(
	/* webpackChunkName: "app-home" */ './app'
) )

registerApp( 'fl-home', {
	label: __( 'Home' ),
	root: App,
	shouldShowInAppList: false,
} )
