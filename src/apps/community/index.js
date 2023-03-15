import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { registerApp } from 'assistant'
import cloud from 'assistant/cloud'

const user = cloud.session.getUser()
const isConnected = cloud.auth.isConnected()
const App = lazy( () => import(
	/* webpackChunkName: "app-community" */ './app'
) )

registerApp( 'community', {
	label: __( 'Community' ),
	root: App,
	enabled: isConnected,
	icon: Icon.Swirl
} )
