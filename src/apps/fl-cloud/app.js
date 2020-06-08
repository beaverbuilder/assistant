import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Nav } from 'assistant/ui'
import { useCloudState } from 'assistant/data'

import Login from './pages/auth/login'
import Register from './pages/auth/register'

import Dashboard from './pages/dashboard'
import Teams from './pages/teams'
import NewTeam from './pages/teams/new-team'
import Sites from './pages/sites'
import NewLibrary from './pages/libraries/new-library'
import NewLibraryItem from './pages/libraries/new-item'
import Library from './pages/libraries/library'
import LibraryItem from './pages/libraries/item'
import Profile from './pages/profile/index.js'
import Subscription from './pages/subscription'

export default ( { baseURL } ) => {
	const { isCloudConnected } = useCloudState()
	const { pathname } = useLocation()
	const history = useHistory()

	if ( ! isCloudConnected && ! pathname.includes( '/auth/' ) ) {
		history.replace( '/fl-cloud/auth/login' )
		return null
	}
	if ( isCloudConnected && pathname.includes( '/auth/' ) ) {
		history.replace( '/fl-cloud' )
		return null
	}

	return (
		<Nav.Switch>
			{ /* Dashboard */ }
			<Nav.Route exact path={ `${baseURL}` } component={ Dashboard } />

			{ /* Auth */ }
			<Nav.Route path={ `${baseURL}/auth/login` } component={ Login } />
			<Nav.Route path={ `${baseURL}/auth/register` } component={ Register } />

			{ /* Teams */ }
			<Nav.Route exact path={ `${baseURL}/teams` } component={ Teams } />
			<Nav.Route path={ `${baseURL}/teams/tab/:tab` } component={ Teams } />
			<Nav.Route path={ `${baseURL}/teams/new` } component={ NewTeam } />

			{ /* Sites */ }
			<Nav.Route path={ `${baseURL}/sites` } component={ Sites } />

			{ /* Libraries */ }
			<Nav.Route path={ `${baseURL}/libraries/new` } component={ NewLibrary } />
			<Nav.Route path={ `${baseURL}/libraries/:id/items/new` } component={ NewLibraryItem } />
			<Nav.Route path={ `${baseURL}/libraries/:id/items/:itemId` } component={ LibraryItem } />
			<Nav.Route path={ `${baseURL}/libraries/:id` } component={ Library } />
			<Nav.Route path={ `${baseURL}/libraries/:id/tab/:tab` } component={ Library } />

			{ /* Profile */ }
			<Nav.Route path={ `${baseURL}/profile` } component={ Profile } />
			<Nav.Route path={ `${baseURL}/profile/tab/:tab` } component={ Profile } />

			{ /* Subscription */ }
			<Nav.Route path={ `${baseURL}/subscription` } component={ Subscription } />
		</Nav.Switch>
	)
}
