import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Nav } from 'ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import CloudLayout from '../layout'

export default ( { match } ) => {

	const { attemptLogin } = getSystemActions()

	const fields = {
		email: {
			label: __( 'Email Address' ),
			component: 'text',
			alwaysCommit: true
		},
		password: {
			label: __( 'Password' ),
			component: 'text',
			type: 'password',
			alwaysCommit: true
		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { email, password } = values

		if ( '' === email ) {
			setErrors( { email: ['Please enter an email address.'] } )
		}
		if ( '' === password ) {
			setErrors( { password: ['Please enter a password.'] } )
		}
	}

	const {
		renderForm,
		submitForm
	} = Form.useForm( {
		fields,
		onSubmit
	} )

	return (
		<CloudLayout className="fl-asst-auth-layout">
			<Layout.Headline>{ __( 'Login to Assistant Cloud' ) }</Layout.Headline>
			{ renderForm() }
			<div className="fl-asst-auth-submit">
				<Button status="primary" onClick={ submitForm } >{__( 'Login' )}</Button>
				<div className="fl-asst-auth-links">
					<Nav.Link to="/fl-cloud/register">{ __( 'Register' ) }</Nav.Link>
					<span> | </span>
					<Nav.Link to="/fl-cloud/forgot-password">{ __( 'Forgot Password?' ) }</Nav.Link>
				</div>
			</div>
		</CloudLayout>
	)
}
