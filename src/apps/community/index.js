import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'
import { getCommunityAppConfig } from '@beaverbuilder/cloud-ui'

const App = lazy( () => import(
	/* webpackChunkName: "app-discover" */ './app'
) )

registerApp( 'discover', {
	...getCommunityAppConfig(),
	label: __( 'Discover' ),
	root: App
} )
