import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemActions, useSystemState, getSystemStore } from 'assistant/data'
import AppMain from '../app'
import { App as FLUID_Root } from 'fluid/ui'
import {
	Appearance,
	App,
	Icon,
	Window,
	Error,
	Page
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

// Top right buttons - only in standalone version
const PanelActions = () => {
	const { toggleIsHidden, toggleSize, size } = useContext( Window.Context )
	return (
		<>
			<button onClick={ toggleSize }>
				{ 'mini' === size && <Icon.Expand /> }
				{ 'normal' === size && <Icon.Collapse /> }
			</button>
			<button onClick={ toggleIsHidden }>
				<Icon.Close />
			</button>
		</>
	)
}

/**
 * The Root Component
 */
export const Assistant = () => {
	const { appearance, history } = useSystemState()
	const { setHistory } = getSystemActions()
	const { brightness = 'light' } = appearance

	const onHistoryChanged = history => setHistory( history.index, history.entries )

	return (
		<FLUID_Root
			routerProps={ getRouterProps( history ) }
			onHistoryChanged={ onHistoryChanged }
			colorScheme={ brightness }
		>
			<App.Provider>
				<Appearance brightness={ brightness }>
					<MainWindow>
						<AppMain actions={ <PanelActions /> } />
					</MainWindow>
				</Appearance>
			</App.Provider>
		</FLUID_Root>
	)
}

// Used for Beaver Builder panel - doesn't have Window Frame or FLUID root.
export const AssistantCore = () => {
	const { appearance } = useSystemState()
	return (
		<App.Provider>
			<Appearance brightness={ appearance.brightness }>
				<AppMain />
			</Appearance>
		</App.Provider>
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

const MainWindow = ( { children } ) => {
	const { window: mainWindow, shouldShowLabels } = useSystemState()
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
			shouldShowLabels={ shouldShowLabels }
			shouldDisplayButton={ '' === hiddenAppearance }
		>
			<Error.Boundary alternate={ WindowError }>
				{children}
			</Error.Boundary>
		</Window>
	)
}

const WindowError = () => {
	return (
		<Page shouldPadTop={ true }>
			<h1>{__( 'We Have A Problem!' )}</h1>
			<p>{__( 'There seems to be an issue inside the window content.' )}</p>
		</Page>
	)
}
