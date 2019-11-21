import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'

export const HomeScreen = () => {
	return (
		<Page shouldPadSides={ false } shouldShowHeader={ false }>
			<Page.RegisteredSections
				location={ { type: 'home' } }
				data={ {} }
			/>
		</Page>
	)
}
