import React from 'react'
import { getSystemActions } from 'store'
import { currentUserCan } from 'utils/wordpress'
import { App } from './app'
import { initialState, actions, reducers, effects } from './state'

const { registerApp } = getSystemActions()

registerApp( 'fl-notifications', {
	label: 'Notifications',
	content: <App />,
	enabled: (
		currentUserCan( 'update_plugins' ) ||
		currentUserCan( 'update_themes' ) ||
		currentUserCan( 'moderate_comments' )
	),
	state: initialState,
	actions,
	reducers,
	effects,
} )
