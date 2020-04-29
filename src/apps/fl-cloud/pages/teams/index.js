import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Filter, Form, Layout, List, Nav, Page } from 'assistant/ui'
import { useCloudState, getCloudActions } from 'data/cloud'
import cloud from 'assistant/utils/cloud'
import { TeamMembers } from './members.js'
import { TeamInvite } from './invite.js'
import { TeamInfo } from './info.js'
import { TeamBilling } from './billing.js'
import { NewTeamForm } from './new-team-form'
import './style.scss'

export default () => {
	const [ teams, setTeams ] = useState( null )

	const loadTeams = () => {
		cloud.teams.getAll().then( response => {
			setTeams( response.data.teams )
		} )
	}

	useEffect( loadTeams, [] )

	const PageContent = () => {
		if ( teams && !! teams.length ) {
			return <Teams teams={ teams } />
		}
		if ( teams && ! teams.length ) {
			return (
				<Layout.Box>
					<Layout.Headline>{ __( 'Get Started With Teams!' ) }</Layout.Headline>
					<p>{ __( 'You\'re not part of any teams. Get started by creating a team or receiving an invite from someone you know.' ) }</p>
					<NewTeamForm
						onCreated={ () => {
							setTeams( null )
							loadTeams()
						} }
					/>
				</Layout.Box>
			)
		}
		if ( ! teams ) {
			return (
				<Layout.Box>
					<Layout.Loading style={ { alignSelf: 'center', alignItems: 'flex-start' } } />
				</Layout.Box>
			)
		}
		return null
	}

	return (
		<Page
			className='fl-asst-teams-layout'
			title={ __( 'Teams' ) }
			shouldShowBackButton={ true }
			padX={ false }
			padY={ false }
		>
			<PageContent />
		</Page>
	)
}

const Teams = ( { teams } ) => {
	const { cloudUser } = useCloudState()
	const { setCloudUser } = getCloudActions()

	const getTeamOptions = () => {
		const options = {}
		if ( teams ) {
			teams.map( team => options[ team.id ] = team.name )
		}
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
		<>
			<Layout.Box style={ { flexDirection: 'row' } }>
				<Form.SelectItem
					options={ getTeamOptions() }
					value={ cloudUser.current_team_id }
					onChange={ value => {
						setCloudUser( {
							...cloudUser,
							current_team_id: parseInt( value ),
						} )
					} }
				></Form.SelectItem>
				<Button to='/fl-cloud/teams/new' style={ { marginLeft: '10px' } }>
					<Icon.Plus />
				</Button>
			</Layout.Box>
			<Layout.Box
				padX={ false }
				padY={ false }
			>
				<Nav.Tabs tabs={ tabs } />
				<Nav.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</>
	)
}
