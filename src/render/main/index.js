import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import classname from 'classnames'
import { Color } from '@beaverbuilder/fluid'
import { Root as AppCoreRoot } from '@beaverbuilder/app-core'
import { getSystemActions, useSystemState, getSystemConfig } from 'assistant/data'
import { Env } from 'assistant/ui'

import Router from './router'
import AppMain from '../app'
import Frame from '../frame'
import FloatingButton from '../frame/button'


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
	const { isShowingAdminBar } = getSystemConfig()
	const { appearance, window: win } = useSystemState( [ 'window', 'appearance' ] )
	const { isHidden, hiddenAppearance } = win
	const showButton = isHidden && ( 'admin_bar' !== hiddenAppearance || ! isShowingAdminBar )
	return (
		<BaseProviders>
			<Color.SchemeProvider value={ appearance.brightness }>
				<Frame isHidden={ isHidden }>
					<AppMain />
				</Frame>
				{ showButton && <FloatingButton /> }
			</Color.SchemeProvider>
		</BaseProviders>
	)
}

// Used for Beaver Builder panel - doesn't have Window Frame or FLUID root.
export const AssistantForBeaverBuilder = () => (
	<BaseProviders displayingIn='beaver-builder'>
		<Frame>
			<AppMain />
		</Frame>
	</BaseProviders>
)
