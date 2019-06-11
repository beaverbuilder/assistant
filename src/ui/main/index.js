import React, { Fragment } from 'fl-react'
import { __ } from 'assistant'
import { getSystemActions, useSystemState } from 'assistant/store'
import { Appearance, Icon, Window, Error } from 'assistant/lib'
import { AppRouting } from '../app'

export const Main = () => {
	const { appearance, window } = useSystemState()
	const { brightness = 'light' } = appearance
	const { size } = window

	return (
		<Appearance brightness={brightness} size={ 'mini' === size ? 'compact' : 'normal' }>
			<MainWindow />
		</Appearance>
	)
}

const MainWindow = () => {
	const { window: mainWindow, shouldShowLabels } = useSystemState()
	const { size, origin, isHidden } = mainWindow
	const { setWindow } = getSystemActions()

	const onChanged = config => setWindow( config )

	return (
		<Window
			icon={<Icon.Pencil size={42} />}
			isHidden={isHidden}
			size={size}
			position={origin}
			onChange={onChanged}
			shouldShowLabels={shouldShowLabels}
		>
			<Error.Boundary alternate={<WindowError />}>
				<AppRouting />
			</Error.Boundary>
		</Window>
	)
}

const WindowError = () => {
	return (
		<Fragment>
			<h1>{__( 'We Have A Problem!' )}</h1>
			<p>{__( 'There seems to be an issue inside the window content.' )}</p>
		</Fragment>
	)
}
