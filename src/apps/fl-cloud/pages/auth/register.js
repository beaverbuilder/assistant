import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Nav } from 'assistant/ui'
import cloud from 'assistant/cloud'
import AuthLayout from './layout'

export default ( { history } ) => {

	const [ errorMessage, setErrorMessage ] = useState( null )

	const fields = {
		first_name: {
			label: __( 'First Name' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter your first name.' ) )
				}
			}
		},
		last_name: {
			label: __( 'Last Name' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter your last name.' ) )
				}
			}
		},
		email: {
			label: __( 'Email Address' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter your email address.' ) )
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
		const { first_name, last_name, email, password } = values

		return cloud.auth.register( first_name, last_name, email, password )
			.then( () => {
				history.replace( '/fl-cloud/auth/login', { registered: true } )
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
		onSubmit
	} )

	return (
		<AuthLayout>
			<Layout.Headline>{ __( 'Sign Up for Assistant Cloud!' ) }</Layout.Headline>
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
					{ __( 'Sign Up!' ) }
				</Button.Loading>
				<div className="fl-asst-auth-links">
					<Nav.Link to="/fl-cloud/auth/login">{ __( 'Login' ) }</Nav.Link>
				</div>
			</div>
		</AuthLayout>
	)
}
