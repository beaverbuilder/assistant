import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout } from 'ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import AuthLayout from './layout'

export default () => {

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
		},
		forgot: {
			component: () => {
				return (
					<a>{ __( 'Forgot Password?' ) }</a>
				)
			}

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
		<AuthLayout>
			<Layout.Headline>{ __( 'Login to Assistant Cloud' ) }</Layout.Headline>
			{ renderForm() }
			<Button status="primary" onClick={ submitForm } >{__( 'Login' )}</Button>
		</AuthLayout>
	)
}
