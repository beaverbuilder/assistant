import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemActions, useSystemState } from 'assistant/store'

import {
	Appearance,
	App,
	Icon,
	Window,
	Error,
	Page,
	Nav
} from 'assistant/lib'

import AppMain from '../app'

import { App as FLUID_Root } from 'fluid/ui'

/**
 * The Root Component
 */
export const Assistant = ({
	frame: Frame = MainWindow
}) => {
	const { appearance, history } = useSystemState()
	const { setHistory } = getSystemActions()
	const { brightness = 'light' } = appearance

	const routerProps = {
		initialIndex: history.index,
		/* do NOT include a default for initialEntries */
	}
	if ( history.entries && history.entries.length ) {
		routerProps.initialEntries = history.entries
	}

	const onHistoryChanged = history => setHistory( history.index, history.entries )

	return (
		<FLUID_Root
			routerProps={routerProps}
			onHistoryChanged={onHistoryChanged}
			colorScheme={brightness}
		>
			<App.Provider>
				<Appearance brightness={ brightness }>
					<Frame>
						<AppMain />
					</Frame>
				</Appearance>
			</App.Provider>
		</FLUID_Root>
	)
}

export const AssistantCore = () => {
	const { appearance } = useSystemState()
	return (
		<FLUID_Root colorScheme={ appearance.brightness } >
			<App.Provider>
				<Appearance brightness={ appearance.brightness }>
					<AppMain />
				</Appearance>
			</App.Provider>
		</FLUID_Root>
	)
}

const MainWindow = ({ children }) => {
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
			toolbar={ WindowToolbar }
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

const WindowToolbar = () => {
	const { isRoot, goToRoot } = useContext( Nav.Context )
	const { label } = useContext( App.Context )
	const labelStyle = {
		padding: '2px 10px'
	}
	const iconWrapStyle = {
		display: 'inline-flex',
		transform: 'translateY(2px)',
		paddingBottom: 4
	}

	const style = {
		pointerEvents: 'none',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	}

	return (
		<span style={ style }>
			{ isRoot && <span style={ labelStyle }>{__( 'Assistant' )}</span> }

			{ ! isRoot && <>
				<button onClick={ goToRoot } style={ {
					pointerEvents: 'auto',
					textDecoration: 'underline',
					padding: '0 10px',
				} }>{__( 'Assistant' )}</button>
				<span style={ iconWrapStyle }><Icon.BreadcrumbArrow /></span>
				<span style={ labelStyle }>{label}</span>
			</> }
		</span>
	)
}
