import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AppRouting } from '../app-manager'
import { Window, useAppearance, PencilIcon } from 'lib'

export const Main = () => {

	// Appearance
	const { appearance, AppearanceContext } = useAppearance( {
		brightness: 'dark',
	} )
	return (
		<MemoryRouter>
			<AppearanceContext.Provider value={appearance}>
				<MainWindow />
			</AppearanceContext.Provider>
		</MemoryRouter>
	)
}

const MainWindow = () => {
	return (
		<Window
			icon={<PencilIcon />}
			size="mini"
			position={[ 1, 0 ]}
		>
			<AppRouting />
		</Window>
	)
}
