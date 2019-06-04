import React from 'fl-react'
import { Appearance, PencilIcon, StoreRouter, Window } from 'assistant/lib'
import { store } from 'assistant'
import { AppRouting } from '../app-manager'

const { getSystemActions, useSystemState } = store

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
		<StoreRouter>
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
		</StoreRouter>
	)
}
