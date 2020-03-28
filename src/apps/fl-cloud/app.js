import React from 'react'
import { Nav } from 'assistant/ui'
import { useCloudState } from 'assistant/data'

import Login from './auth/login'
import Register from './auth/register'
import ForgotPassword from './auth/forgot-password'

import Home from './pages/home'
import Profile from './pages/profile'

export default ( { match } ) => {
	return (
		<Nav.Switch>
			<Nav.Route exact path={ `${match.url}` } component={ Main } />
			<Nav.Route path={ `${match.url}/login` } component={ Login } />
			<Nav.Route path={ `${match.url}/register` } component={ Register } />
			<Nav.Route path={ `${match.url}/forgot-password` } component={ ForgotPassword } />
			<Nav.Route path={ `${match.url}/profile` } component={ Profile } />
		</Nav.Switch>
	)
}

const Main = () => {
	const { isCloudConnected } = useCloudState()
	return isCloudConnected ? <Home /> : <Login />
}
