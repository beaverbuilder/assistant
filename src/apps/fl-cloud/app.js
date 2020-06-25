import React from 'react'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import { useSystemState } from 'assistant/data'
import cloud from 'assistant/cloud'

import Connect from './pages/connect'
import Dashboard from './pages/dashboard'
import Teams from './pages/teams'
import NewTeam from './pages/teams/new-team'
import NewLibrary from './pages/libraries/new-library'
import NewLibraryItem from './pages/libraries/items/new-item'
import Library from './pages/libraries/library'
import LibraryItem from './pages/libraries/items/item'
import Profile from './pages/profile/index.js'

export default ( { baseURL } ) => {
	const { pathname } = useLocation()
	const history = useHistory()
	const { isCloudConnected } = useSystemState( 'isCloudConnected' )

	if ( ! isCloudConnected && ! pathname.includes( '/connect' ) ) {
		history.replace( '/fl-cloud/connect' )
		return null
	}
	if ( isCloudConnected && pathname.includes( '/connect' ) ) {
		history.replace( '/fl-cloud' )
		return null
	}

	return (
		<Switch>
			{ /* Dashboard */ }
			<Route exact path={ `${baseURL}` } component={ Dashboard } />

			{ /* Auth */ }
			<Route path={ `${baseURL}/connect` } component={ Connect } />

			{ /* Teams */ }
			<Route exact path={ `${baseURL}/teams` } component={ Teams } />
			<Route path={ `${baseURL}/teams/tab/:tab` } component={ Teams } />
			<Route path={ `${baseURL}/teams/new` } component={ NewTeam } />

			{ /* Libraries */ }
			<Route path={ `${baseURL}/libraries/new` } component={ NewLibrary } />
			<Route path={ `${baseURL}/libraries/:id/items/new` } component={ NewLibraryItem } />
			<Route path={ `${baseURL}/libraries/:id/items/:itemId` } component={ LibraryItem } />
			<Route path={ `${baseURL}/libraries/:id` } component={ Library } />
			<Route path={ `${baseURL}/libraries/:id/tab/:tab` } component={ Library } />

			{ /* Profile */ }
			<Route path={ `${baseURL}/profile` } component={ Profile } />
			<Route path={ `${baseURL}/profile/tab/:tab` } component={ Profile } />
		</Switch>
	)
}
