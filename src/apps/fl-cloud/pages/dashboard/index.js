import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import cloud from 'assistant/utils/cloud'
import { Button, Form, Layout, List, Nav, Page } from 'assistant/ui'
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
			<CurrentlyViewing />
			<Libraries />
		</Page>
	)
}

const ElevatorButtons = () => (
	<div style={ {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		margin: '10px 0 0',
		flex: '0 0 auto',
	} } >
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
		<Button
			appearance='elevator'
			title={ __( 'Sites' ) }
			to='/fl-cloud/sites'
		>
			<span
				className="dashicons dashicons-networking"
				style={ { marginTop: '-8px' } }
			></span>
		</Button>
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
	</div>
)

const CurrentlyViewing = () => {
	const { currentPageView } = getSystemConfig()
	const { name, intro } = currentPageView

	return (
		<Layout.Box padX={ false }>
			<div
				className="fl-asst-currently-viewing-summary"
				style={ {
					background: 'var(--fluid-box-background)',
					borderRadius: 'var(--fluid-radius)',
					padding: 'var(--fluid-lg-space)',
				} }
			>
				{ intro && <div className="fl-asst-pretitle">{intro}</div> }
				<div className="fl-asst-title">{name}</div>
			</div>
			<Button.Group appearance="buttons" style={ { alignSelf: 'start', marginTop: '2px' } }>
				<Button>Save to Cloud</Button>
				<Button>Sync to Site</Button>
			</Button.Group>
		</Layout.Box>
	)
}
