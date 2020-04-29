import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Nav } from 'assistant/ui'
import { useCloudState } from 'assistant/data'

import Login from './pages/auth/login'
import Register from './pages/auth/register'
import ForgotPassword from './pages/auth/forgot-password'

import Dashboard from './pages/dashboard'
import Sites from './pages/sites'
import Profile from './pages/profile/index.js'
import Subscription from './pages/subscription'

export default () => {
	const { isCloudConnected } = useCloudState()
	const { pathname } = useLocation()
	const history = useHistory()
	const baseURL = '/fl-cloud'

	if ( ! isCloudConnected && ! pathname.includes( '/auth/' ) ) {
		history.replace( '/fl-cloud/auth/login' )
		return null
	}

	return (
		<Nav.Switch>
			<Nav.Route exact path={ baseURL } component={ Dashboard } />
			<Nav.Route path={ `${baseURL}/auth/login` } component={ Login } />
			<Nav.Route path={ `${baseURL}/auth/register` } component={ Register } />
			<Nav.Route path={ `${baseURL}/auth/forgot-password` } component={ ForgotPassword } />
			<Nav.Route path={ `${baseURL}/sites` } component={ Sites } />
			<Nav.Route path={ `${baseURL}/profile` } component={ Profile } />
			<Nav.Route path={ `${baseURL}/subscription` } component={ Subscription } />
		</Nav.Switch>
	)
}
