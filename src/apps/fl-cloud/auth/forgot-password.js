import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Nav } from 'ui'
import CloudLayout from '../layout'

export default () => {

	const fields = {
		email: {
			label: __( 'Email Address' ),
			component: 'text'
		}
	}

	const onSubmit = ( { values } ) => {
		const { email } = values

		setIsSubmitting( false )

		if ( '' === email ) {
			alert( 'Please enter an email address.' )
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
			<Layout.Headline>{ __( 'Reset Password' ) }</Layout.Headline>
			{ renderForm() }
			<div className="fl-asst-auth-submit">
				<Button status="primary" onClick={ submitForm } >{__( 'Reset Password' )}</Button>
				<div className="fl-asst-auth-links">
					<Nav.Link to="/fl-cloud/login">{ __( 'Login' ) }</Nav.Link>
					<span> | </span>
					<Nav.Link to="/fl-cloud/register">{ __( 'Register' ) }</Nav.Link>
				</div>
			</div>
		</CloudLayout>
	)
}
