import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'assistant/ui'
import AppIcon from './icon'

export default () => {

	return (
		<Page
			title={ __( 'Cloud' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
		>
			Welcome
		</Page>
	)
}
