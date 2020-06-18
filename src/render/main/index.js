import React, { useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { Root as AppCoreRoot, Error } from '@beaverbuilder/app-core'
import { getSystemActions, useSystemState, getSystemStore } from 'assistant/data'
import {
	Appearance,
	Icon,
	Page,
	Env,
} from 'assistant/ui'
import AppMain from '../app'
import Window from '../window'

const getRouterProps = history => {
	const props = {
		initialIndex: history.index,

		/* do NOT include a default for initialEntries */
	}
	if ( history.entries && history.entries.length ) {
		props.initialEntries = history.entries
	}
	return props
}

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
		'fluid': true,
		'fl': true,
		'uid': true,
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
		appearance,
		history,
		isAppHidden
	} = useSystemState( ( state, newState ) => {
		return (
			state.appearance.brightness !== newState.appearance.brightness ||
			state.isAppHidden !== newState.isAppHidden

		// We only need history initially - we're not listening for changes
		)
	} )
	const { brightness = 'light' } = appearance
	const windowClasses = classname( { 'fl-asst-window-sidebar-only': isAppHidden } )

	return (
		<AppCoreRoot routerProps={ getRouterProps( history ) }>
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
		<Env.Provider application='beaver-builder'>
			<Appearance brightness={ appearance.brightness }>
				<AppMain />
			</Appearance>
		</Env.Provider>
	)
}

export const getAssistantBBPanelConfig = () => {
	const { setHistory } = getSystemActions()

	const getProps = () => {
		const { history } = getSystemStore().getState()
		return getRouterProps( history )
	}

	return {
		className: 'fl-asst',
		render: () => <AssistantCore />,
		routerProps: getProps,
		onHistoryChanged: history => setHistory( history.index, history.entries )
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
