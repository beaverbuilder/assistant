import React from 'react'
import { getSystemActions } from 'store'
import { App, AppIcon } from './app'
import { initialState, actions, reducers, effects } from './state'

const { registerApp } = getSystemActions()

registerApp( 'fl-users', {
	label: 'Users',
	content: () => <App />,
	icon: () => <AppIcon />,
	state: initialState,
	actions,
	reducers,
	effects,
} )
