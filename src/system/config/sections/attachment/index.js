import React from 'react'
import { getSystemActions } from 'store'
import { Form, Control } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-media-details', {
	label: __( 'Metadata' ),
	location: {
		type: 'attachment',
	},
	render: ( { useForm } ) => {

		const { title, alt, caption, description } = useForm()

		return (
            <>
				<Form.TextItem { ...title } />
				<Form.TextItem { ...alt } />
				<Form.TextItem { ...description } />
				<Form.TextItem { ...caption } />
            </>
		)
	},
} )

registerSection( 'fl-media-links', {
	label: __( 'Links' ),
	location: {
		type: 'attachment',
	},
	render: ( { attachment, useForm } ) => {

		const { url } = useForm()

		let hasFullURL = false
		if ( 'undefined' !== typeof attachment.sizes.full ) {
			hasFullURL = true
		}

		return (
            <>
				{ hasFullURL && (
					<Form.Item label={ __( 'File URL' ) }>
						<Control.URL value={ attachment.sizes.full.url } />
					</Form.Item>
				)}

				<Form.Item label={ url.label } labelForm={ url.id }>
					<Control.URL
						value={ url.value }
						onChange={ url.onChange }
					/>
				</Form.Item>
            </>
		)
	},
} )
