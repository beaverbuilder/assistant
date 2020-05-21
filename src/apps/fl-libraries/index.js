import { lazy } from 'react'
import { registerApp } from 'assistant'
import { __ } from '@wordpress/i18n'

const App = lazy( () => import(
	/* webpackChunkName: "app-libraries" */ './app'
) )

registerApp( 'fl-libraries', {
	label: __( 'Libraries' ),
	root: App,
} )
