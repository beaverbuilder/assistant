import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Nav } from 'assistant/ui'
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
		<Nav.Switch>
			{ /* Dashboard */ }
			<Nav.Route exact path={ `${baseURL}` } component={ Dashboard } />

			{ /* Auth */ }
			<Nav.Route path={ `${baseURL}/connect` } component={ Connect } />

			{ /* Teams */ }
			<Nav.Route exact path={ `${baseURL}/teams` } component={ Teams } />
			<Nav.Route path={ `${baseURL}/teams/tab/:tab` } component={ Teams } />
			<Nav.Route path={ `${baseURL}/teams/new` } component={ NewTeam } />

			{ /* Libraries */ }
			<Nav.Route path={ `${baseURL}/libraries/new` } component={ NewLibrary } />
			<Nav.Route path={ `${baseURL}/libraries/:id/items/new` } component={ NewLibraryItem } />
			<Nav.Route path={ `${baseURL}/libraries/:id/items/:itemId` } component={ LibraryItem } />
			<Nav.Route path={ `${baseURL}/libraries/:id` } component={ Library } />
			<Nav.Route path={ `${baseURL}/libraries/:id/tab/:tab` } component={ Library } />

			{ /* Profile */ }
			<Nav.Route path={ `${baseURL}/profile` } component={ Profile } />
			<Nav.Route path={ `${baseURL}/profile/tab/:tab` } component={ Profile } />
		</Nav.Switch>
	)
}
