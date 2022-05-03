import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'

const App = lazy( () => import(
	/* webpackChunkName: "app-discover" */ './app'
) )

registerApp( 'discover', {
	label: __( 'Discover' ),
	root: App
} )
