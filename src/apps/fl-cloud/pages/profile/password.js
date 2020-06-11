import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout } from 'assistant/ui'
import cloud from 'assistant/cloud'

export const ProfilePassword = () => {
	const [ successMessage, setSuccessMessage ] = useState( null )
	const [ errorMessage, setErrorMessage ] = useState( null )

	const fields = {
		current_password: {
			label: __( 'Current Password' ),
			component: 'text',
			type: 'password',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter your password.' ) )
				}
			}
		},
		new_password: {
			label: __( 'New Password' ),
			component: 'text',
			type: 'password',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter your new password.' ) )
				}
			}
		},
		confirm_password: {
			label: __( 'Confirm Password' ),
			component: 'text',
			type: 'password',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please confirm your new password.' ) )
				}
			}
		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		setErrorMessage( null )
		setSuccessMessage( null )
		return cloud.user.updatePassword( values ).then( () => {
			setSuccessMessage( true )
		} ).catch( error => {
			setErrors( error.response.data.errors )
			setErrorMessage( error.response.data.message )
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
		<>
			{ errorMessage && (
				<Layout.Box padX={ false }>
					<Layout.Message status='destructive'>
						{ errorMessage }
					</Layout.Message>
				</Layout.Box>
			) }
			{ successMessage && (
				<Layout.Box padX={ false }>
					<Layout.Message status='primary'>
						{ __( 'Password updated!' ) }
					</Layout.Message>
				</Layout.Box>
			) }
			{ renderForm() }
			<Button.Loading
				status="primary"
				onClick={ submitForm }
				isLoading={ isSubmitting }
			>
				{ __( 'Change Password' ) }
			</Button.Loading>
		</>
	)
}
