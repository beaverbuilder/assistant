import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Nav } from 'ui'
import { useCloudState } from 'assistant/data'
import { cloudRegister } from 'assistant/utils/cloud'
import CloudLayout from '../layout'

export default ( { history } ) => {

	const { cloudErrors } = useCloudState()

	const fields = {
		name: {
			label: __( 'Name' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter your name.' ) )
				}
			}
		},
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

	const onSubmit = ( { values } ) => {
		const { name, email, password } = values

		return cloudRegister( name, email, password ).then( () => {
			history.replace( '/fl-cloud' )
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
		<CloudLayout className="fl-asst-auth-layout">
			<Layout.Headline>{ __( 'Sign Up for Assistant Cloud!' ) }</Layout.Headline>
			{ !! cloudErrors.length && (
				<Layout.Box padX={ false }>
					<Layout.Message status='destructive'>
						{ cloudErrors.pop() }
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
					<Nav.Link to="/fl-cloud/login">{ __( 'Login' ) }</Nav.Link>
				</div>
			</div>
		</CloudLayout>
	)
}
