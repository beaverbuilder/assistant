import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'

export default () => {

	const fields = {
		type: {
			label: __( 'Item Type' ),
			component: 'select',
			alwaysCommit: true,
			options: {
				none:  __( 'Choose...' ),
				post: __( 'Post' ),
				image: __( 'Image' ),
				svg: __( 'SVG' ),
			}
		},
	}

	const onSubmit = ( { values, setErrors } ) => {
		// return cloud.libraries.addItem( library.id, {
		// 	name: 'Test'
		// } )
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
