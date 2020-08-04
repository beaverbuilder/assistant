import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout } from 'assistant/ui'
import cloud from 'assistant/cloud'
import { getFormData, getFormConfig } from './utils'

export default ( { item, setItem } ) => {

	const fields = {
		name: {
			label: __( 'Name' ),
			component: 'text',
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a name.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { name } = values
		const data = getFormData( values, { name } )
		return cloud.libraries.updateItem( item.id, data ).then( response => {
			setItem( response.data )
		} ).catch( error => {
			setErrors( error.response.data.errors )
		} )
	}

	const {
		renderForm,
		submitForm,
		isSubmitting,
		hasChanges
	} = Form.useForm( {
		defaults: item,
		fields,
		onSubmit,
		...getFormConfig( fields, item, setItem ),
	} )

	return (
		<Layout.Box padY={ false }>
			{ renderForm() }
			{ hasChanges &&
				<Button onClick={ submitForm } disabled={ isSubmitting }>
					{ __( 'Update Item' ) }
				</Button>
			}
		</Layout.Box>
	)
}
