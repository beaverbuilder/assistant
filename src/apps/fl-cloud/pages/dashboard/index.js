import React from 'react'
import { __ } from '@wordpress/i18n'
import cloud from 'assistant/cloud'
import { Button, Layout, Page } from 'assistant/ui'
import AppIcon from '../../icon'
import Libraries from '../libraries'

export default () => {
	return (
		<Page
			title={ __( 'Libraries' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			actions={ <PageActions /> }
		>
			<Libraries />
		</Page>
	)
}

const PageActions = () => {
	return (
		<Button
			title={ __( 'Logout' ) }
			onClick={ cloud.auth.logout }
		>
			<span
				className="dashicons dashicons-lock"
			></span>
		</Button>
	)
}
