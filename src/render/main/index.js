import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { Root as AppCoreRoot, Error } from '@beaverbuilder/app-core'
import {
	getSystemActions,
	useSystemState,
} from 'assistant/data'

import {
	Appearance,
	Icon,
	Page,
	Env,
} from 'assistant/ui'
import AssistantRouter from './router'
import AppMain from '../app'
import Window from '../window'

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
const FLUIDAppearanceRoot = ( {
	colorScheme = 'light',
	className,
	...rest
} ) => {
	const classes = classname( 'fluid fl uid', {
		[`fluid-color-scheme-${colorScheme}`]: colorScheme
	}, className )

	return (
		<div className={ classes } { ...rest } />
	)
}

/**
 * The Root Component
 */
export const Assistant = () => {
	const {
		appearance: { brightness = 'light' },
		isAppHidden
	} = useSystemState( ( a, b ) => (
		a.appearance.brightness !== b.appearance.brightness ||
		a.isAppHidden !== b.isAppHidden
	) )
	const windowClasses = classname( {
		'fl-asst-window-sidebar-only': isAppHidden
	} )

	return (
		<AppCoreRoot router={ AssistantRouter } >
			<HistoryManager />
			<Env.Provider>
				<FLUIDAppearanceRoot colorScheme={ brightness }>
					<Appearance brightness={ brightness }>
						<MainWindow className={ windowClasses }>
							<AppMain />
						</MainWindow>
					</Appearance>
				</FLUIDAppearanceRoot>
			</Env.Provider>
		</AppCoreRoot>
	)
}

// Used for Beaver Builder panel - doesn't have Window Frame or FLUID root.
export const AssistantCore = () => {
	const { appearance } = useSystemState( 'appearance' )
	return (
		<AppCoreRoot router={ AssistantRouter } >
			<HistoryManager />
			<Env.Provider application='beaver-builder'>
				<AppMain allowHidingApps={false} />
			</Env.Provider>
		</AppCoreRoot>
	)
}

export const getAssistantBBPanelConfig = () => {
	const { setHistory } = getSystemActions()

	const getProps = () => {

		//const { history } = getSystemStore().getState()
		//return getRouterProps( history )
		return {}
	}

	return {
		className: 'fl-asst',
		label: __('Assistant'),
		root: AssistantCore,
		/*
		routerProps: getProps,
		onHistoryChanged: history => setHistory( history.index, history.entries )
		*/
	}
}

const MainWindow = ( { children, ...rest } ) => {
	const { window: mainWindow } = useSystemState( 'window' )
	const { size, origin, isHidden, hiddenAppearance } = mainWindow
	const { setWindow } = getSystemActions()
	const onChanged = config => setWindow( { ...mainWindow, ...config } )

	return (
		<Window
			icon={ <Icon.Pencil size={ 42 } /> }
			isHidden={ isHidden }
			size={ size }
			position={ origin }
			onChange={ onChanged }
			shouldDisplayButton={ '' === hiddenAppearance }
			{ ...rest }
		>
			<Error.Boundary alternate={ WindowError }>
				{children}
			</Error.Boundary>
		</Window>
	)
}

const WindowError = props => (
	<Page.Error
		message={ __( 'There seems to be an issue in the Assistant panel.' ) }
		{ ...props }
	/>
)
