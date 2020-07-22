import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( { libraryId, onCreate } ) => {

	const fields = {
		color: {
			label: __( 'Hex Value' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( ! value ) {
					errors.push( __( 'Please enter a hex value.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { color } = values
		const data = {
			type: 'color',
			name: color,
			data: {
				hex: color
			}
		}

		return cloud.libraries.createItem( libraryId, data ).then( () => {
			onCreate()
		} ).catch( error => {
			setErrors( error.response.data.errors )
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
			{ renderForm() }
			<Button.Loading isLoading={ isSubmitting } onClick={ submitForm }>
				{ __( 'Add Color' ) }
			</Button.Loading>
		</>
	)
}
