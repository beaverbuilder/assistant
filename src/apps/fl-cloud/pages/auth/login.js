import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Nav } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'
import AuthLayout from './layout'

export default ( { location, history } ) => {
	const { registered } = location.state ? location.state : {}
	const [ errorMessage, setErrorMessage ] = useState( null )

	const fields = {
		email: {
			label: __( 'Email Address' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter an email address.' ) )
				}
			}
		},
		password: {
			label: __( 'Password' ),
			component: 'text',
			type: 'password',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a password.' ) )
				}
			}
		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { email, password } = values

		return cloud.auth.login( email, password )
			.then( () => {
				if ( history ) {
					history.replace( '/fl-cloud' )
				}
			} )
			.catch( ( error ) => {
				setErrorMessage( error.message )
				setErrors( error.errors )
			} )
	}

	const {
		renderForm,
		submitForm,
		isSubmitting
	} = Form.useForm( {
		fields,
		onSubmit,
		defaults: {
			email: 'test@test.com',
			password: 'testing',
		}
	} )

	return (
		<AuthLayout>
			<Layout.Headline>{ __( 'Login to Assistant Cloud' ) }</Layout.Headline>
			{ registered && ! errorMessage && (
				<Layout.Box padX={ false }>
					<Layout.Message status='primary'>
						{ __( 'Registration successful! Please login.' ) }
					</Layout.Message>
				</Layout.Box>
			) }
			{ errorMessage && (
				<Layout.Box padX={ false }>
					<Layout.Message status='destructive'>
						{ errorMessage }
					</Layout.Message>
				</Layout.Box>
			) }
			{ renderForm() }
			<div className="fl-asst-auth-submit">
				<Button.Loading
					status="primary"
					onClick={ submitForm }
					isLoading={ isSubmitting }
				>
					{ __( 'Login' ) }
				</Button.Loading>
				<div className="fl-asst-auth-links">
					<Nav.Link to="/fl-cloud/auth/register">{ __( 'Register' ) }</Nav.Link>
					<span> | </span>
					<Nav.Link to="/fl-cloud/auth/forgot-password">{ __( 'Forgot Password?' ) }</Nav.Link>
				</div>
			</div>
		</AuthLayout>
	)
}
