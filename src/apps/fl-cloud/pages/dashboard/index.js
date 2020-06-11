import React from 'react'
import { __ } from '@wordpress/i18n'
import cloud from 'assistant/cloud'
import { Button, Layout, Page } from 'assistant/ui'
import AppIcon from '../../icon'
import Libraries from '../libraries'

export default () => {
	return (
		<Page
			title={ __( 'Cloud' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
		>
			<ElevatorButtons />
			<Libraries />
		</Page>
	)
}

const ElevatorButtons = () => (
	<Layout.Box
		padX={ false }
		style={ {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			flex: '0 0 auto',
		} }
	>
		<Button
			appearance='elevator'
			title={ __( 'Teams' ) }
			to='/fl-cloud/teams'
		>
			<span
				className="dashicons dashicons-buddicons-buddypress-logo"
				style={ { marginTop: '-8px' } }
			></span>
		</Button>
		{/*<Button
			appearance='elevator'
			title={ __( 'Sites' ) }
			to='/fl-cloud/sites'
		>
			<span
				className="dashicons dashicons-networking"
				style={ { marginTop: '-8px' } }
			></span>
		</Button>*/}
		<Button
			appearance='elevator'
			title={ __( 'Profile' ) }
			to='/fl-cloud/profile'
		>
			<span
				className="dashicons dashicons-admin-users"
				style={ { marginTop: '-8px' } }
			></span>
		</Button>
		<Button
			appearance='elevator'
			title={ __( 'Logout' ) }
			onClick={ cloud.auth.logout }
		>
			<span
				className="dashicons dashicons-lock"
				style={ { marginTop: '-8px' } }
			></span>
		</Button>
	</Layout.Box>
)
