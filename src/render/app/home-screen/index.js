import React from 'react'
import { Page } from 'assistant/ui'

export const HomeScreen = () => {
	return (
		<Page padY={ false } toolbar={ false }>
			<Page.RegisteredSections
				location={ { type: 'home' } }
				data={ {} }
			/>
		</Page>
	)
}
