import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( { libraryId, onCreate } ) => {

	const fields = {
		image: {
			label: __( 'Image' ),
			component: 'file',
			alwaysCommit: true,
			accept: 'image/png, image/jpeg',
			validate: ( value, errors ) => {
				if ( ! value ) {
					errors.push( __( 'Please choose a file.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { image } = values
		const data = new FormData()

		data.append( 'type', 'image' )
		data.append( 'name', image[0].name )
		data.append( 'media', image[0] )

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
				{ __( 'Add Image' ) }
			</Button.Loading>
		</>
	)
}
