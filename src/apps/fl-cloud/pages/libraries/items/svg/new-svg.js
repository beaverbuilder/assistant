import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( { libraryId, onCreate } ) => {

	const fields = {
		svg: {
			label: __( 'SVG File' ),
			component: 'file',
			alwaysCommit: true,
			accept: 'image/svg+xml',
			validate: ( value, errors ) => {
				if ( ! value ) {
					errors.push( __( 'Please choose a file.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { svg } = values
		const reader = new FileReader()
		const data = {
			type: 'svg',
			name: svg[0].name
		}

		reader.onerror = () => {
			alert( __( 'There was an error reading the selected file.' ) )
		}

		reader.onload = e => {
			data.data = { xml: e.target.result }
			return cloud.libraries.createItem( libraryId, data ).then( () => {
				onCreate()
			} ).catch( error => {
				setErrors( error.response.data.errors )
			} )
		}

		reader.readAsText( svg[0] )
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
				{ __( 'Add SVG' ) }
			</Button.Loading>
		</>
	)
}
