import React from 'react'
import { AppRouting } from '../app-manager'
import { Window, Appearance, PencilIcon } from 'lib'
import { MemoryRouter } from 'react-router-dom'
import { getSystemActions, useSystemState } from 'store'

export const Main = () => {
	const { appearance } = useSystemState()
	const { brightness = 'light' } = appearance
	return (
		<Appearance brightness={brightness}>
			<MainWindow />
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
		<MemoryRouter>
			<Window
				icon={<PencilIcon />}
				isHidden={isHidden}
				size={size}
				position={origin}
				onChange={onChanged}
				shouldShowLabels={shouldShowLabels}
			>
				<AppRouting />
			</Window>
		</MemoryRouter>
	)
}
