import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'
import AppIcon from './icon'

const App = () => {
	return (
		<Page
			title={ __( 'Currently Viewing' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
		>Hey</Page>
	)
}

export default App
