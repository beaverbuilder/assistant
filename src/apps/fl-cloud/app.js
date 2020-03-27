import React from 'react'
import { __ } from '@wordpress/i18n'
import { Nav, Page } from 'assistant/ui'
import { useCloudState } from 'assistant/data'
import AppIcon from './icon'

import Login from './auth/login'
import Register from './auth/register'
import ForgotPassword from './auth/forgot-password'

import Home from './pages/home'
import Profile from './pages/profile'

export default ( { match } ) => {
	const { isCloudConnected } = useCloudState()

	return (
		<Nav.Switch>
			<Nav.Route exact path={ `${match.url}` } component={ isCloudConnected ? Home : Login } />
			<Nav.Route path={ `${match.url}/login` } component={ Login } />
			<Nav.Route path={ `${match.url}/register` } component={ Register } />
			<Nav.Route path={ `${match.url}/forgot-password` } component={ ForgotPassword } />
			<Nav.Route path={ `${match.url}/profile` } component={ Profile } />
		</Nav.Switch>
	)
}
