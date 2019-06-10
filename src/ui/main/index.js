import React from 'fl-react'
import { store } from 'assistant'
import { Appearance, Icon, Window, Error } from 'assistant/lib'
import { Docs } from 'lib'
import { AppRouting } from '../app'

const { getSystemActions, useSystemState } = store

export const Main = () => {
	const { appearance, window } = useSystemState()
	const { brightness = 'light' } = appearance
	const { size, origin } = window

	return (
		<Appearance brightness={brightness} size={ 'mini' === size ? 'compact' : 'normal' }>
			<MainWindow />

			{ false &&
			<DocsPanel
				brightness={ 'light' === brightness ? 'dark' : 'light' }
				align={ origin[0] ? 'left' : 'right' }
				margin={ 'mini' === size ? 360 : 480 }
			/> }
		</Appearance>
	)
}

const MainWindow = () => {
	const { window: mainWindow, shouldShowLabels } = useSystemState()
	const { size, origin, isHidden } = mainWindow
	const { setWindow } = getSystemActions()
	const onChanged = config => {
		setWindow( config )
	}

	return (
		<Window
			icon={<Icon.Pencil size={40} />}
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

const DocsPanel = ( { brightness, margin, align } ) => {
	return (
		<Appearance brightness={brightness}>
			<Docs align={align} windowMargin={margin} />
		</Appearance>
	)
}

const WindowError = () => {
	return (
		<h1>Problem!</h1>
	)
}
