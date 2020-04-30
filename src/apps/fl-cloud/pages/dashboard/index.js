import React, { useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { getSystemConfig } from 'assistant/data'
import cloud from 'assistant/utils/cloud'
import { Button, Form, Layout, List, Nav, Page } from 'assistant/ui'
import AppIcon from '../../icon'

export default () => {
	return (
		<Page
			title={ __( 'Cloud' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
		>
			<ElevatorButtons />
			<CurrentlyViewing />
			<Library />
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
	const { name, intro, actions } = currentPageView

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

const Library = () => {
	const [ teams ] = cloud.teams.useAll()

	let tabs = [
		{
			handle: 'content',
			label: __( 'Content' ),
			path: '/fl-cloud',
			component: LibraryContent,
			exact: true,
		},
		{
			handle: 'sites',
			label: __( 'Site Templates' ),
			path: '/fl-cloud/tab/content',
			component: LibrarySites,
		}
	]

	const getTeamOptions = () => {
		const options = {
			0: __( 'Your Library' ),
		}
		if ( teams ) {
			teams.map( team => options[ team.id ] = team.name )
		}
		return options
	}

	return (
		<Page.Section label={ __( 'Library' ) } padX={ false }>
			<Layout.Box style={ { paddingTop: 0 } }>
				<Form.SelectItem
					options={ getTeamOptions() }
					value={ 0 }
					onChange={ value => {} }
				></Form.SelectItem>
			</Layout.Box>
			<Nav.Tabs tabs={ tabs } />
			<Nav.CurrentTab tabs={ tabs } />
		</Page.Section>
	)
}

const LibrarySites = () => {
	const wrapStyle = {
		display: 'flex',
		flexWrap: 'wrap',
		padding: '5px'
	}

	const itemStyle = {
		padding: '10px',
		width: '50%',
		textAlign: 'center'
	}

	return (
		<div style={ wrapStyle }>
			<div style={ itemStyle }>
				<img src="https://picsum.photos/200" />
				<div>Site 1</div>
			</div>
			<div style={ itemStyle }>
				<img src="https://picsum.photos/200" />
				<div>Site 2</div>
			</div>
			<div style={ itemStyle }>
				<img src="https://picsum.photos/200" />
				<div>Site 3</div>
			</div>
			<div style={ itemStyle }>
				<img src="https://picsum.photos/200" />
				<div>Site 4</div>
			</div>
		</div>
	)
}

const LibraryContent = () => {
	const items = [
		{ label: 'Posts (11)' },
		{ label: 'Pages (32)' },
		{ label: 'Lead Gen (7)' },
		{ label: 'Hero Rows (55)' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
		}
	}

	return (
		<List
			items={ items }
			getItemProps={ getItemProps }
		/>
	)
}
