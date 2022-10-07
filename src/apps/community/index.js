import { lazy } from 'react'
import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'
import cloud from 'assistant/cloud'

const user = cloud.session.getUser()
const isAdmin = null === user ? false : user?.is_admin
const isConnected = cloud.auth.isConnected()
const App = lazy( () => import(
	/* webpackChunkName: "app-community" */ './app'
) )

registerApp( 'community', {
	label: __( 'Community' ),
	root: App,
	enabled: isAdmin && isConnected
} )
