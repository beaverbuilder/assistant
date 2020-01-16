import React from 'react'
import { getSystemActions } from 'data'
import { Form } from 'ui'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-term-details', {
	label: __( 'Basic Info' ),
	location: {
		type: 'term',
	},
	render: ( { useFormData_Deprecated } ) => {
		const { title, slug, parent, description } = useFormData_Deprecated()

		return (
            <>
                <Form.TextItem { ...title } />
				<Form.TextItem { ...slug } />
				<Form.SelectItem { ...parent } />
				<Form.TextItem { ...description } />
            </>
		)
	},
} )
