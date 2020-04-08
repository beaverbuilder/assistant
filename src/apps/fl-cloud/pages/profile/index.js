import React from 'react'
import { __ } from '@wordpress/i18n'
import { useCloudState } from 'assistant/data'
import { Button, Form, Layout, Page } from 'ui'

export default () => {
	const { cloudUser } = useCloudState()

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
			component: 'email',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter an email address.' ) )
				}
			}
		},
		password: {
			label: __( 'Change Password' ),
			component: 'text',
			type: 'password',
			alwaysCommit: true
		}
	}

	const {
		renderForm,
		submitForm,
		isSubmitting
	} = Form.useForm( {
		fields,
		defaults: cloudUser
	} )

	return (
		<Page
			title={ __( 'Profile' ) }
			shouldShowBackButton={ true }
		>
			<Layout.Headline>{ __( 'Your Profile' ) }</Layout.Headline>
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
