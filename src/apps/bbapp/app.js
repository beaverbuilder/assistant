import React, { useEffect, useState } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { useSystemState, useAppState, getAppActions } from 'assistant/data'
import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { Libraries } from '../libraries/ui'
import { CommunityApp, Modal } from '@beaverbuilder/cloud-ui'
import cloud from 'assistant/cloud'
import classname from 'classnames'
import CloudConnect from '../fl-cloud-connect/app'
import './style.scss'

export default ( { baseURL } ) => {

	return (
		<>
			<Switch>
				<Route path='/bbapp/library/:id' component={ Modal } />
				<Route path='/bbapp/user/:id' component={ Modal } />
				<Route path='/bbapp/item/:id' component={ Modal } />
				<Route path={ `${baseURL}` } component={ () => <Main baseURL={baseURL} /> } />
			</Switch>
			<Modal baseURL={ baseURL } />
		</>
	)
}

const Main = ( { baseURL } ) => {

	const { setActiveTab } = getAppActions( 'bbapp' )
	const { activeTab } = useAppState( 'bbapp' )
	const [ libraries, setLibraries ] = useState( [] )
	const [ teams, setTeams ] = useState( [] )
	const [ folders, setFolders ] = useState( { user: [], team: {} } )
	const [ isLoadingLibraries, setIsLoadingLibraries ] = useState( true )
	const [ isLoadingTeams, setIsLoadingTeams ] = useState( true )
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	useEffect(() => {
		if( isCloudConnected ) {
			const fetchData = async () => {
				try {
					setIsLoadingTeams( true )
					setIsLoadingLibraries( true )
					const [ teamsRes, librariesRes, foldersRes ] = await Promise.all( [
						cloud.teams.getAll(),
						cloud.libraries.getAllSortedByOwner(),
						cloud.libraries.getFolders().catch( () => ( { data: { user: [], team: {} } } ) ),
					] )
					setTeams( teamsRes.data )
					setLibraries( librariesRes )
					setFolders( foldersRes.data || { user: [], team: {} } )
				} catch ( error ) {
					console.error("Error:", error)
				} finally {
					setIsLoadingTeams( false )
					setIsLoadingLibraries( false )
				}
			}
			fetchData()
		}
	}, [])

	return (
		<div class="fl-asst-bbapp-wrap">
			<div class="fl-asst-bbapp-tabs">
				<button
					onClick={ () => setActiveTab('libraries') }
					className={ classname( 'fl-asst-tab-button', { 'is-active': activeTab === 'libraries' } ) }
				>
					<span class="fl-asst-item-icon">
						<Icon.Library />
					</span>
					<span> { __( 'Libraries' ) } </span>
				</button>
				<button
					onClick={ () => setActiveTab('showcase') }
					className={ classname( 'fl-asst-tab-button', { 'is-active': activeTab === 'showcase' } ) }
				>
					<span className="fl-asst-item-icon">
						<Icon.Swirl />
					</span>
					<span> { __( 'Showcase' ) } </span>
				</button>
			</div>

			<div className="fl-asst-tab-content">
				{ activeTab === 'libraries' && ! isCloudConnected &&
					<CloudConnect baseURL={ baseURL } />
				}

				{ activeTab === 'libraries' && isCloudConnected &&
					<Libraries
						preloadedLib={ libraries }
						preloadedTeams={ teams }
						preloadedFolders={ folders }
						isLoadingLibraries={ isLoadingLibraries }
					/>
				}

				{ activeTab === 'showcase' &&
					<CommunityApp baseURL={ baseURL } showcase={ 1 } />
				}
			</div>
		</div>
	)
}
