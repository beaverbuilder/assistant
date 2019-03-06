import React from '@assistant/react'
import { getSystemActions } from '@assistant/store'
import { App, AppIcon } from './app'
import { initialState, actions, reducers, effects } from './state'

const { registerApp } = getSystemActions()

registerApp( 'fl-media', {
	label: 'Media',
	content: <App />,
	icon: <AppIcon />,
	state: initialState,
	actions,
	reducers,
	effects,
} )
