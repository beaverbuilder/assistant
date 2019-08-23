import React, { useContext } from 'fl-react'
import { __ } from 'assistant'
import { getSystemActions, useSystemState } from 'assistant/store'
import { Appearance, App, Icon, Window, Error, Page, Nav } from 'assistant/lib'
import { AppRouting } from '../app'

export const Main = () => {
	const { appearance, window } = useSystemState()
	const { brightness = 'light' } = appearance
	const { size } = window

	return (
		<Nav.Provider>
			<App.Provider>
				<Appearance brightness={ brightness } size={ 'mini' === size ? 'compact' : 'normal' }>
					<MainWindow />
				</Appearance>
			</App.Provider>
		</Nav.Provider>
	)
}

const MainWindow = () => {
	const { window: mainWindow, shouldShowLabels } = useSystemState()
	const { size, origin, isHidden, shouldDisplayButtonWhenHidden } = mainWindow
	const { setWindow } = getSystemActions()

	const onChanged = config => setWindow( config )

	return (
		<Window
			icon={ <Icon.Pencil size={ 42 } /> }
			isHidden={ isHidden }
			size={ size }
			position={ origin }
			onChange={ onChanged }
			shouldShowLabels={ shouldShowLabels }
			shouldDisplayButton={ shouldDisplayButtonWhenHidden }
			toolbar={ WindowToolbar }
		>
			<Error.Boundary alternate={ WindowError }>
				<AppRouting />
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
	const labelStyle = { padding: '2px 10px' }
	const iconWrapStyle = { display: 'inline-flex', transform: 'translateY(2px)' }

	return (
		<span>
			{ isRoot && <span style={ labelStyle }>{__( 'Assistant' )}</span> }

			{ ! isRoot && <>
				<button onClick={ goToRoot } style={ { textDecoration: 'underline' } }>{__( 'Assistant' )}</button>
				<span style={ iconWrapStyle }><Icon.BreadcrumbArrow /></span>
				<span style={ labelStyle }>{label}</span>
			</> }
		</span>
	)
}
