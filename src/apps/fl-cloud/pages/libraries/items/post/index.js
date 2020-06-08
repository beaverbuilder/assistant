import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default ( { item, setItem } ) => {
	const fields = {
		post_title: {
			label: __( 'Title' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a title.' ) )
				}
			}
		},
		post_name: {
			label: __( 'Slug' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a slug.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const requestData = {
			name: values.post_title,
			data: {
				...item.data,
				...values
			}
		}
		return cloud.libraries.updateItem( item.id, requestData ).then( response => {
			setItem( response.data )
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
		onSubmit,
		defaults: item.data,
	} )

	return (
		<>
			{ renderForm() }
			<Button.Loading onClick={ submitForm } isLoading={ isSubmitting }>
				{ __( 'Update Item' ) }
			</Button.Loading>
		</>
	)
}
