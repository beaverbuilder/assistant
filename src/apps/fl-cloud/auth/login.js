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
			component: 'text'
		},
		password: {
			label: __( 'Password' ),
			component: 'text',
			type: 'password'
		}
	}

	const onSubmit = ( { values } ) => {
		const { email, password } = values

		setIsSubmitting( false )

		if ( '' === email ) {
			alert( 'Please enter an email address.' )
			return
		}
		if ( '' === password ) {
			alert( 'Please enter a password.' )
			return
		}
	}

	const {
		renderForm,
		submitForm,
		setIsSubmitting
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
