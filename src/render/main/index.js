import React from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { getSystemActions, useSystemState, getSystemStore } from 'assistant/data'
import AppMain from '../app'
import { App as FLUIDApp } from 'fluid/ui'
import {
	Appearance,
	App,
	Icon,
	Window,
	Error,
	Page,
	Env,
} from 'assistant/ui'

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

	const { setHistory } = getSystemActions()
	const { brightness = 'light' } = appearance

	const onHistoryChanged = history => setHistory( history.index, history.entries )

	const windowClasses = classname( {
		'fl-asst-window-sidebar-only': isAppHidden,
	} )

	return (
		<FLUIDApp.Root
			routerProps={ getRouterProps( history ) }
			onHistoryChanged={ onHistoryChanged }
			colorScheme={ brightness }
		>
			<Env.Provider>
				<App.Provider>
					<Appearance brightness={ brightness }>
						<MainWindow className={ windowClasses }>
							<AppMain />
						</MainWindow>
					</Appearance>
				</App.Provider>
			</Env.Provider>
		</FLUIDApp.Root>
	)
}

// Used for Beaver Builder panel - doesn't have Window Frame or FLUID root.
export const AssistantCore = () => {
	const { appearance } = useSystemState( 'appearance' )
	return (
		<Env.Provider application='beaver-builder'>
			<App.Provider>
				<Appearance brightness={ appearance.brightness }>
					<AppMain />
				</Appearance>
			</App.Provider>
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
		message={__('There seems to be an issue in the Assistant panel.')}
		{...props}
	/>
)
