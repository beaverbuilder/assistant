import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'store'
import { App, AppIcon } from './app'
import { initialState, actions, reducers, effects } from './state'

const { registerApp } = getSystemActions()

registerApp( 'fl-media', {
	label: __( 'Media' ),
	content: <App />,
	icon: <AppIcon />,
	state: initialState,
	actions,
	reducers,
	effects,
} )
