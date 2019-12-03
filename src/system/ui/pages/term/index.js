import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'ui'

export const Term = ( { location } ) => {

	const defaultItem = {
		title: '',
		slug: '',
		parent: '',
		description: '',
		taxonomy: '',
	}
	let term = defaultItem

	if ( 'undefined' !== typeof location.state &&
		'undefined' !== typeof location.state.item ) {

		term = { ...defaultItem, ...location.state.item }
	}

	const { form, useFormContext } = Form.useFormData( {
		title: {
			label: __( 'Name' ),
			labelPlacement: 'beside',
		},
		slug: {
			label: __( 'Slug' ),
			labelPlacement: 'beside',
		},
		parent: {
			label: __( 'Parent' ),
			labelPlacement: 'beside',
			options: {
				'': __( 'None' ),
			},
		},
		description: {
			label: __( 'Description' ),
			type: 'textarea',
			rows: 4,
		},
	}, {}, term )

	return (
		<Page title={ __( 'Edit Term' ) } shouldPadSides={ false }>
			<Form { ...form }>
				<Page.RegisteredSections
					location={ { type: 'term' } }
					data={ { useFormData: useFormContext } }
				/>
			</Form>
		</Page>
	)
}
