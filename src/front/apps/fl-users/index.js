import React from 'react'
import { getSystemActions } from 'store'
import { wordpress } from 'utils'
import { App, AppIcon } from './app'
import { initialState, actions, reducers, effects } from './state'
const { currentUserCan } = wordpress
const { registerApp } = getSystemActions()

registerApp( 'fl-users', {
	label: 'Users',
	content: () => <App />,
	icon: () => <AppIcon />,
	enabled: currentUserCan( 'edit_users' ),
	state: initialState,
	actions,
	reducers,
	effects,
} )
