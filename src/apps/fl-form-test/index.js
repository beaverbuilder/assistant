import React from 'react'
import { registerApp } from 'assistant'
import { Form, Page } from 'assistant/ui'
import { __ } from '@wordpress/i18n'

export const App = () => {

	const fields = {
		fieldOne: {
			label: __( 'Field 1' ),
			component: 'text'
		},
	}

	const { renderForm } = Form.useForm( { fields } )

	return (
		<Page
			title={ __( 'Form Test' ) }
		>
			{ renderForm() }
		</Page>
	)
}

registerApp( 'fl-form-test', {
	label: __( 'Form Test' ),
	root: App,
} )
