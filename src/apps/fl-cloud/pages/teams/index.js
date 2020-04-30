import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Filter, Form, Layout, List, Nav, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import { TeamMembers } from './members.js'
import { TeamInvite } from './invite.js'
import { TeamInfo } from './info.js'
import './style.scss'

export default ( { history } ) => {
	const [ currentTeamId, setCurrentTeamId ] = useState( 0 )
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
			component: () => {
				return (
					<TeamInfo
						team={ team ? team : {} }
						onUpdate={ data => {
							teams.map( ( team, i ) => {
								if ( data.id === team.id ) {
									teams[i] = data
								}
							} )
							setTeam( data )
							setTeams( [ ...teams ] )
						} }
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
			{ ! teams &&
				<Layout.Box>
					<Layout.Loading style={ { alignSelf: 'center', alignItems: 'flex-start' } } />
				</Layout.Box>
			}
			{ teams &&
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
