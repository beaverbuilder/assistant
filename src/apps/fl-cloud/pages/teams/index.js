import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Form, Layout, Nav, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import { TeamMembers } from './members.js'
import { TeamInvite } from './invite.js'
import { TeamInfo } from './info.js'
import './style.scss'

export default ( { history, location } ) => {
	const { id } = location.state ? location.state : {}
	const [ currentTeamId, setCurrentTeamId ] = useState( id ? id : 0 )
	const [ teams, setTeams ] = cloud.teams.useAll()
	const [ team, setTeam ] = cloud.teams.useOne( currentTeamId )

	useEffect( () => {
		if ( ! currentTeamId && teams && teams.length ) {
			setCurrentTeamId( teams[0].id )
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
		setCurrentTeamId( 0 )
		setTeam( null )
		setTeams( teams.filter( team => team.id !== id ) )
	}

	const leaveTeam = () => {
		const { id } = team
		if ( confirm( __( 'Do you really want to leave this team?' ) ) ) {
			setCurrentTeamId( 0 )
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
			{ ( ! teams || ! currentTeamId ) &&
				<Layout.Box>
					<Layout.Loading style={ { alignSelf: 'center', alignItems: 'flex-start' } } />
				</Layout.Box>
			}
			{ teams && !! currentTeamId &&
				<>
					<Layout.Box style={ { flexDirection: 'row' } }>
						<Form.SelectItem
							options={ getTeamOptions() }
							value={ currentTeamId }
							onChange={ value => setCurrentTeamId( parseInt( value ) ) }
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
						{ ( ! team || ( team.id !== currentTeamId ) ) &&
							<Layout.Box>
								<Layout.Loading style={ { alignSelf: 'center', alignItems: 'flex-start' } } />
							</Layout.Box>
						}
						{ team && team.id === currentTeamId &&
							<Nav.CurrentTab tabs={ tabs } />
						}
					</Layout.Box>
				</>
			}
		</Page>
	)
}
