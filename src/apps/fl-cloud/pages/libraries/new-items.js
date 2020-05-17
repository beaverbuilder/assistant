import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default () => {
	const history = useHistory()
	const { id } = useParams()

	const fields = {
		type: {
			label: __( 'Item Type' ),
			component: 'select',
			alwaysCommit: true,
			options: {
				none: __( 'Choose...' ),
				post: __( 'Post' ),
				image: __( 'Image' ),
				svg: __( 'SVG' ),
			},
			validate: ( value, errors ) => {
				if ( ! value || 'none' === value ) {
					errors.push( __( 'Please choose a type.' ) )
				}
			}
		},
		name: {
			label: __( 'Name' ),
			component: 'text',
			alwaysCommit: true,
			validate: ( value, errors ) => {
				if ( '' === value ) {
					errors.push( __( 'Please enter a name.' ) )
				}
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		const { name, type } = values
		return cloud.libraries.createItem( id, {
			type,
			name,
		} ).then( () => {
			history.goBack()
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
		<Page
			title={ __( 'Add Items' ) }
			shouldShowBackButton={ true }
		>
			<Layout.Headline>
				{ __( 'Add Library Items' ) }
			</Layout.Headline>
			{ renderForm() }
			<Button.Loading isLoading={ isSubmitting } onClick={ submitForm }>
				{ __( 'Add Items' ) }
			</Button.Loading>
		</Page>
	)
}
