import React from 'react'
import { AppRouting } from '../app-manager'
import { Window, useAppearance, PencilIcon } from 'lib'
import { DesignSystemDocs } from 'lib/docs'
import { getSystemActions, useSystemState } from 'store'

export const Main = () => {

	// Appearance
	const { appearance, AppearanceContext } = useAppearance( {
		brightness: 'dark',
	} )
	return (
		<AppearanceContext.Provider value={appearance}>
			<MainWindow />
		</AppearanceContext.Provider>
	)
}

const MainWindow = () => {
	const { window: mainWindow } = useSystemState()
	const { size, origin, isHidden } = mainWindow
	const { setWindow } = getSystemActions()

	const onChanged = config => {
		setWindow( config )
	}

	return (
		<Window
			icon={<PencilIcon />}
			isHidden={isHidden}
			size={size}
			position={origin}
			onChange={onChanged}
		>
			<AppRouting />
		</Window>
	)
}
