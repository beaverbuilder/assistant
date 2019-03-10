import React from 'react'
import { getSystemActions } from 'store'
import { App, Icon } from './app'
import storeConfig from './state'
const { registerApp } = getSystemActions()

registerApp( 'fl-dashboard', {
	label: 'Dashboard',
	content: <App />,
	icon: <Icon />,
	...storeConfig,
} )
