import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'store'
import { App, Icon } from './app'
import storeConfig from './state'
const { registerApp } = getSystemActions()

registerApp( 'fl-dashboard', {
	label: __( 'Dashboard' ),
	content: <App />,
	icon: <Icon />,
	shouldShowTitle: false,
	...storeConfig,
} )
