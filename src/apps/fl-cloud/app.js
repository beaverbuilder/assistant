import React from 'react'
import { Switch, Route, useHistory, useLocation } from 'react-router-dom'
import cloud from 'assistant/cloud'

import Connect from './pages/auth/connect'
import Login from './pages/auth/login'
import Register from './pages/auth/register'

import Dashboard from './pages/dashboard'
import Teams from './pages/teams'
import NewTeam from './pages/teams/new-team'
import Sites from './pages/sites'
import NewLibrary from './pages/libraries/new-library'
import NewLibraryItem from './pages/libraries/items/new-item'
import Library from './pages/libraries/library'
import LibraryItem from './pages/libraries/items/item'
import Profile from './pages/profile/index.js'
import Subscription from './pages/subscription'

export default ( { baseURL } ) => {
	const { pathname } = useLocation()
	const history = useHistory()
	const isCloudConnected = cloud.auth.isConnected()

	if ( ! isCloudConnected && ! pathname.includes( '/auth/' ) ) {

		//history.replace( '/fl-cloud/auth/connect' )
		history.replace( '/fl-cloud/auth/login' )
		return null
	}
	if ( isCloudConnected && pathname.includes( '/auth/' ) ) {
		history.replace( '/fl-cloud' )
		return null
	}

	return (
		<Switch>
			{ /* Dashboard */ }
			<Route exact path={ `${baseURL}` } component={ Dashboard } />

			{ /* Auth */ }
			<Route path={ `${baseURL}/auth/connect` } component={ Connect } />
			<Route path={ `${baseURL}/auth/login` } component={ Login } />
			<Route path={ `${baseURL}/auth/register` } component={ Register } />

			{ /* Teams */ }
			<Route exact path={ `${baseURL}/teams` } component={ Teams } />
			<Route path={ `${baseURL}/teams/tab/:tab` } component={ Teams } />
			<Route path={ `${baseURL}/teams/new` } component={ NewTeam } />

			{ /* Sites */ }
			<Route path={ `${baseURL}/sites` } component={ Sites } />

			{ /* Libraries */ }
			<Route path={ `${baseURL}/libraries/new` } component={ NewLibrary } />
			<Route path={ `${baseURL}/libraries/:id/items/new` } component={ NewLibraryItem } />
			<Route path={ `${baseURL}/libraries/:id/items/:itemId` } component={ LibraryItem } />
			<Route path={ `${baseURL}/libraries/:id` } component={ Library } />
			<Route path={ `${baseURL}/libraries/:id/tab/:tab` } component={ Library } />

			{ /* Profile */ }
			<Route path={ `${baseURL}/profile` } component={ Profile } />
			<Route path={ `${baseURL}/profile/tab/:tab` } component={ Profile } />

			{ /* Subscription */ }
			<Route path={ `${baseURL}/subscription` } component={ Subscription } />
		</Switch>
	)
}
