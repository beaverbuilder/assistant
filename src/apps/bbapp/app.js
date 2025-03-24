import React, { useEffect, useState } from 'react'
import { Redirect, Switch, Route, useHistory } from 'react-router-dom'
import { Selection } from '@beaverbuilder/fluid'
import { useSystemState } from 'assistant/data'
import { __ } from '@wordpress/i18n'
import { Page, Layout } from 'assistant/ui'
import { Library, Libraries } from '../libraries/ui'
import { CommunityApp, Modal } from '@beaverbuilder/cloud-ui'
import '@beaverbuilder/cloud-ui/dist/index.css'
import cloud from 'assistant/cloud'

export default ( { baseURL } ) => {

	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	if ( ! isCloudConnected ) {
		history.replace( '/fl-cloud-connect' )
		return null
	}

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

	const [ activeTab, setActiveTab ] = useState( 'libraries' )
	const [ libraries, setLibraries ] = useState( [] )
	const [ isLoadingLibraries, setIsLoadingLibraries ] = useState( true )

	const getDefaultLibraries = () => ( {
		user: [],
		team: {},
		shared: [],
		access: [],
	} )

	useEffect( () => {
		setIsLoadingLibraries( true )
		cloud.libraries.getAllSortedByOwner().then( response => {
			setLibraries( response )
			setIsLoadingLibraries( false )
		} )
	}, [] )

	const tabStyle = (isActive) => ({
		padding: '10px 20px',
		color: isActive ? 'var(--fluid-opaque-14)' : 'var(--fluid-opaque-5)',
		backgroundColor: isActive ? 'var(--fluid-opaque-4)' : 'var(--fluid-transparent-12)',
		cursor: 'pointer',
		outline: 'none',
	})

	return (
		<div style={ { padding: '16px 0' } }>
			<div style={ {
				display: 'flex',
				backgroundColor: 'var(--fluid-opaque-13)',
				justifyContent: 'center',
				gap: '10px',
				padding: '8px',
				borderRadius: '8px',
				width: 'fit-content',
				margin: 'auto',
			} }>
				<button
					onClick={ () => setActiveTab('libraries') }
					style={ tabStyle(activeTab === 'libraries') }
				>
					Libraries
				</button>
				<button
					onClick={ () => setActiveTab('community') }
					style={ tabStyle(activeTab === 'community') }
				>
					Community
				</button>
			</div>

			<div style={ { borderTop: 'none' } }>
				{ 'libraries' === activeTab && <Libraries  preloaded={ libraries } /> }
				{ 'community' === activeTab && <CommunityApp baseURL={ baseURL} /> }
			</div>
		</div>
	)
}
