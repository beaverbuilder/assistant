import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form, Control } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-media-details', {
	label: __( 'Metadata' ),
	location: {
		type: 'attachment',
	},
	render: ( { attachment } ) => {

		// TEMP - update with real func
		const setValue = () => {}
		return (
            <>
				<Form.Item label={ __( 'Title' ) } labelFor="title">
					<input
						id="title"
						type="text"
						required={ true }
						placeholder={ __( 'Attachment Title' ) }
						value={ attachment.title }
						onChange={ e => setValue( 'title', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Alternative Text' ) } labelFor="alt">
					<input
						id="alt"
						type="text"
						required={ true }
						placeholder={ __( 'Describe your file' ) }
						value={ attachment.alt }
						onChange={ e => setValue( 'alt', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Description' ) } labelFor="description" isRequired={ true }>
					<textarea
						id="description"
						value={ attachment.description }
						rows={ 4 }
						onChange={ e => setValue( 'description', e.target.value ) }
					/>
				</Form.Item>
				<Form.Item label={ __( 'Caption' ) } labelFor="caption">
					<textarea
						id="caption"
						value={ attachment.caption }
						rows={ 4 }
						onChange={ e => setValue( 'caption', e.target.value ) }
					/>
				</Form.Item>
            </>
		)
	},
} )

registerSection( 'fl-media-links', {
	label: __( 'Links' ),
	location: {
		type: 'attachment',
	},
	render: ( { attachment } ) => {
		let hasFullURL = false
		if ( 'undefined' !== typeof attachment.sizes.full ) {
			hasFullURL = true
		}
		return (
            <>
				{ hasFullURL && (
					<Form.Item label={ __( 'File URL' ) }>
						<Control.URL url={ attachment.sizes.full.url } />
					</Form.Item>
				)}

				<Form.Item label={ __( 'Attachment Page' ) }>
					<Control.URL url={ attachment.url } />
				</Form.Item>
            </>
		)
	},
} )
