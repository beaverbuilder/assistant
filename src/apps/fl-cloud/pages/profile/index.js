import React from 'react'
import { __ } from '@wordpress/i18n'
import { Layout, Nav, Page } from 'assistant/ui'
import { ProfileSettings } from './settings.js'
import { ProfilePassword } from './password.js'

export default () => {
	let tabs = [
		{
			handle: 'settings',
			label: __( 'Settings' ),
			path: '/fl-cloud/profile',
			component: ProfileSettings,
			exact: true,
		},
		{
			handle: 'sites',
			label: __( 'Password' ),
			path: '/fl-cloud/profile/tab/password',
			component: ProfilePassword,
		}
	]

	return (
		<Page
			title={ __( 'Profile' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box padX={ false } style={ { paddingBottom: '0px' } }>
				<Nav.Tabs tabs={ tabs } />
			</Layout.Box>
			<Layout.Box padY={ false }>
				<Nav.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</Page>
	)
}
