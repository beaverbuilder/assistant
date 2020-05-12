import React from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { useCloudState } from 'assistant/data'
import { cloudLogout } from 'assistant/utils/cloud'
import { Button, Layout, Page } from 'assistant/ui'
import AppIcon from '../../icon'

export default () => {
	const { cloudUser } = useCloudState()

	return (
		<Page
			title={ __( 'Cloud' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
		>
			<Layout.Headline>{ sprintf( 'Welcome, %s', cloudUser.name ) }</Layout.Headline>
			<Layout.Box padX={ false }>
				<Button.Group direction='column'>
					<Button to='/fl-cloud/sites'>{ __( 'Manage Sites' ) }</Button>
					<Button to='/fl-cloud/profile'>{ __( 'Edit Profile' ) }</Button>
					<Button to='/fl-cloud/subscription'>{ __( 'Subscription' ) }</Button>
					<Button onClick={ cloudLogout }>{ __( 'Logout' ) }</Button>
				</Button.Group>
			</Layout.Box>
		</Page>
	)
}
