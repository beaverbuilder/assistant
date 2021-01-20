import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import classname from 'classnames'
import { Root as AppCoreRoot } from '@beaverbuilder/app-core'
import { getSystemActions, useSystemState } from 'assistant/data'
import { Env } from 'assistant/ui'

import Router from './router'
import AppMain from '../app'
import Frame from '../frame'


const HistoryManager = () => {
	const location = useLocation()
	const history = useHistory()
	const { setHistory } = getSystemActions()

	// Whenever location changes, fire onChange handler.
	useEffect( () => {
		setHistory( history.index, history.entries )
	}, [ location ] )

	return null
}

// TEMP fluid root
const FLUIDAppearanceRoot = ( { colorScheme = 'light', className, ...rest } ) => {
	const classes = classname( {
		[`fluid-color-scheme-${colorScheme}`]: colorScheme
	}, className )

	return (
		<div className={ classes } { ...rest } />
	)
}

const BaseProviders = ( { displayingIn, children } ) => (
	<AppCoreRoot router={ Router } >
		<HistoryManager />
		<Env.Provider application={ displayingIn }>
			{children}
		</Env.Provider>
	</AppCoreRoot>
)

/**
 * The Normal Standalone Root Component
 */
export const Assistant = () => {
	const hasChanged = ( a, b ) => (
		a.appearance.brightness !== b.appearance.brightness ||
		a.window.isHidden !== b.window.isHidden
	)
	const { window: { isHidden, hiddenAppearance }, appearance } = useSystemState( hasChanged )
	const shouldRenderDOM = ! isHidden || 'admin_bar' !== hiddenAppearance

	return (
		<BaseProviders>
			{ shouldRenderDOM && (
				<FLUIDAppearanceRoot colorScheme={ appearance.brightness }>
					<Frame>
						<AppMain />
					</Frame>
				</FLUIDAppearanceRoot>
			) }
		</BaseProviders>
	)
}

// Used for Beaver Builder panel - doesn't have Window Frame or FLUID root.
export const AssistantForBeaverBuilder = () => (
	<BaseProviders displayingIn='beaver-builder'>
		<AppMain allowHidingApps={ false } />
	</BaseProviders>
)
