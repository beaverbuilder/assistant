import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { useCloudState, getCloudActions } from 'assistant/data'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default () => {
	const [ successMessage, setSuccessMessage ] = useState( null )
	const [ errorMessage, setErrorMessage ] = useState( null )
	const { cloudUser } = useCloudState()
	const { setCloudUser } = getCloudActions()

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
			component: 'email',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter an email address.' ) )
				}
			}
		}
	}

	const onSubmit = ( { values, setErrors } ) => {
		setErrorMessage( null )
		setSuccessMessage( null )
		return cloud.user.update( values ).then( response => {
			setCloudUser( response.data )
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
		onSubmit,
		defaults: cloudUser
	} )

	return (
		<Page
			title={ __( 'Profile' ) }
			shouldShowBackButton={ true }
		>
			<Layout.Headline>{ __( 'Your Profile' ) }</Layout.Headline>
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
						{ __( 'Changes saved!' ) }
					</Layout.Message>
				</Layout.Box>
			) }
			{ renderForm() }
			<Button.Loading
				status="primary"
				onClick={ submitForm }
				isLoading={ isSubmitting }
			>
				{ __( 'Save Changes' ) }
			</Button.Loading>
		</Page>
	)
}
