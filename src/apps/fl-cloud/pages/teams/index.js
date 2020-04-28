import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Filter, Form, Layout, List, Nav, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default () => {
	const [ teams, setTeams ] = useState( [] )

	useEffect( () => {
		cloud.api.getTeams().then(
			response => setTeams( response.data.teams )
		)
	}, [] )

	const getTeamOptions = () => {
		const options = {}
		teams.map( team => options[ team.id ] = team.name )
		return options
	}

	let tabs = [
		{
			handle: 'members',
			label: __( 'Members' ),
			path: '/fl-cloud/teams',
			component: TeamMembers,
			exact: true,
		},
		{
			handle: 'invite',
			label: __( 'Invite' ),
			path: '/fl-cloud/teams/tab/invite',
			component: TeamInvite,
		},
		{
			handle: 'settings',
			label: __( 'Settings' ),
			path: '/fl-cloud/teams/tab/settings',
			component: TeamInfo,
		},
		{
			handle: 'billing',
			label: __( 'Subscription' ),
			path: '/fl-cloud/teams/tab/billing',
			component: TeamBilling,
		}
	]

	return (
		<Page
			className='fl-asst-teams-layout'
			title={ __( 'Teams' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<Layout.Box>
				<Form.SelectItem
					options={ getTeamOptions() }
				></Form.SelectItem>
			</Layout.Box>
			<Layout.Box
				padX={ false }
				padY={ false }
			>
				<Nav.Tabs tabs={ tabs } />
				<Nav.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</Page>
	)
}

const TeamMembers = () => {
	const items = [
		{ label: 'Brent Jett', description: 'Admin' },
		{ label: 'Danny Holt', description: 'Member' },
		{ label: 'Jamie VanRaalte', description: 'Member' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
		}
	}

	return (
		<>
			<Filter>
				<Filter.RadioGroupItem
					title={ __( 'Role' ) }
					items={ {
						any: __( 'Any' ),
						admin: __( 'Admin' ),
						member: __( 'Member' )
					} }
					value={ 'any' }
					defaultValue={ 'any' }
					onChange={ () => {} }
				/>
				<Filter.RadioGroupItem
					title={ __( 'Status' ) }
					items={ {
						active: __( 'Active' ),
						pending: __( 'Pending' )
					} }
					value={ 'active' }
					defaultValue={ 'active' }
					onChange={ () => {} }
				/>
			</Filter>
			<List
				items={ items }
				getItemProps={ getItemProps }
			/>
		</>
	)
}

const TeamInvite = () => {
	const items = [
		{ label: 'Billy Young', description: 'billy@young.com' },
		{ label: 'Robby McCullough', description: 'robby@mccullough.com' },
		{ label: 'Justin Busa', description: 'justin@busa.com' }
	]

	const getItemProps = ( item, defaults ) => {
		return {
			...defaults,
			label: item.label,
			description: item.description,
			shouldAlwaysShowThumbnail: true,
			thumbnailSize: 'sm',
		}
	}

	return (
		<>
			<Layout.Box
				style={ {
					display: 'flex',
					flexDirection: 'row',
					paddingBottom: '0'
				} }
			>
				<Form.TextItem
					placeholder="Email Address"
					style={ {
						width: '50%',
						margin: '0 5px 0 0'
					} }
				></Form.TextItem>
				<Button>{ __( 'Invite' ) }</Button>
			</Layout.Box>
			<Layout.Box>
				<Page.Section label={ __( 'Pending Invites' ) } padX={ false }>
					<List
						items={ items }
						getItemProps={ getItemProps }
					/>
				</Page.Section>
			</Layout.Box>
		</>
	)
}

const TeamInfo = () => {
	return null
}

const TeamBilling = () => {
	return null
}
