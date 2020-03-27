import React from 'react'
import { __ } from '@wordpress/i18n'
import { Nav, Page } from 'assistant/ui'
import AppIcon from './icon'
import Login from './auth/login'
import Register from './auth/register'
import ForgotPassword from './auth/forgot-password'

export default ( { match } ) => {
	return (
		<Nav.Switch>
			<Nav.Route path={ `${match.url}` } component={ Login } />
		</Nav.Switch>
	)
}
