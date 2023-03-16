import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { registerApp } from 'assistant'

const App = lazy( () => import(
	/* webpackChunkName: "app-community" */ './app'
) )

registerApp( 'community', {
	label: __( 'Community' ),
	root: App,
	icon: Icon.Swirl
} )
