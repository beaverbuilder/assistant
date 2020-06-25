import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Form, Layout, Nav, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'
import { TeamMembers } from './members.js'
import { TeamInvite } from './invite.js'
import { TeamInfo } from './info.js'
import './style.scss'

export default ( { history } ) => {
	const [ currentTeam, setCurrentTeam ] = useState( 0 )
	const [ teams, setTeams ] = cloud.teams.useAll()
	const [ team, setTeam ] = cloud.teams.useOne( currentTeam )

	useEffect( () => {
		if ( ! currentTeam && teams && teams.length ) {
			setCurrentTeam( teams[0].id )
		}
	}, [ teams ] )

	if ( teams && ! teams.length ) {
		history.replace( '/fl-cloud/teams/new', { welcome: true } )
		return null
	}

	const getTeamOptions = () => {
		const options = {}
		if ( teams ) {
			teams.map( team => options[ team.id ] = team.name )
		}
		return options
	}

	const onTeamUpdated = data => {
		teams.map( ( team, i ) => {
			if ( data.id === team.id ) {
				teams[i] = data
			}
		} )
		setTeam( data )
		setTeams( [ ...teams ] )
	}

	const onTeamDeleted = id => {
		setCurrentTeam( 0 )
		setTeam( null )
		setTeams( teams.filter( team => team.id !== id ) )
	}

	const leaveTeam = () => {
		const { id } = team
		if ( confirm( __( 'Do you really want to leave this team?' ) ) ) {
			setCurrentTeam( 0 )
			setTeam( null )
			cloud.teams.delete( id ).then( () => {
				setTeams( teams.filter( team => team.id !== id ) )
			} )
		}
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
			component: () => {
				return (
					<TeamInvite
						team={ team ? team : {} }
					/>
				)
			},
		},
		{
			handle: 'settings',
			label: __( 'Settings' ),
			path: '/fl-cloud/teams/tab/settings',
			component: () => {
				return (
					<TeamInfo
						team={ team ? team : {} }
						onUpdate={ onTeamUpdated }
						onDelete={ onTeamDeleted }
					/>
				)
			},
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
			{ ( ! teams || ! currentTeam ) &&
				<Layout.Box>
					<Layout.Loading style={ { alignSelf: 'center', alignItems: 'flex-start' } } />
				</Layout.Box>
			}
			{ teams && !! currentTeam &&
				<>
					<Layout.Box style={ { flexDirection: 'row' } }>
						<Form.SelectItem
							options={ getTeamOptions() }
							value={ currentTeam }
							onChange={ value => setCurrentTeam( parseInt( value ) ) }
						></Form.SelectItem>
						<Button to='/fl-cloud/teams/new' style={ { marginLeft: '10px' } }>
							<Icon.Plus />
						</Button>
					</Layout.Box>
					<Layout.Box
						style={ {
							alignItems: 'flex-end',
							paddingTop: '0'
						} }
					>
						<a onClick={ leaveTeam }>{ __( 'Leave Team' ) }</a>
					</Layout.Box>
					<Layout.Box
						padX={ false }
						padY={ false }
					>
						<Nav.Tabs tabs={ tabs } />
						{ ( ! team || ( team.id !== currentTeam ) ) &&
							<Layout.Box>
								<Layout.Loading style={ { alignSelf: 'center', alignItems: 'flex-start' } } />
							</Layout.Box>
						}
						{ team && team.id === currentTeam &&
							<Nav.CurrentTab tabs={ tabs } />
						}
					</Layout.Box>
				</>
			}
		</Page>
	)
}
