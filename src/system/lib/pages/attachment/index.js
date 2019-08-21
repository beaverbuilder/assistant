import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'lib'
import utils from 'utils'
const { react: { useInitialFocus } } = utils

/**
 * Get a srcset string from an object of sizes.
 * Expects size.url and size.width to be present.
 */
const getSrcSet = ( sizes = {} ) => {
	return Object.values( sizes ).map( size => {
		return size.url + ' ' + size.width + 'w'
	} ).join( ', ' )
}

export const Attachment = ( { location } ) => {
	const firstRef = useInitialFocus()
	const defaultItem = {
		sizes: {}
	}
	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem
	const srcSet = getSrcSet( item.sizes )

	const onFormChange = () => {}

	const [ values, setValue ] = Form.useFormState( {
		title: item.title,
		description: item.description,
	}, onFormChange )

	return (
		<Page shouldPadSides={ false } title={ __( 'Attachment' ) }>
			<Page.Toolbar shouldPadBottom={ true }>
				<img src={ item.thumbnail } srcSet={ srcSet } />
			</Page.Toolbar>

			<Form>
                <Form.Section label={__('Metadata')}>
    				<Form.Item label={ __( 'Name' ) } labelFor="name" isRequired={ true } placement="beside">
    					<input
    						id="name"
    						type="text"
    						required={ true }
    						placeholder={ __( 'Attachment Title' ) }
    						value={ values.title }
    						onChange={ e => setValue( 'title', e.target.value ) }
    						ref={ firstRef }
    					/>
    				</Form.Item>
    				<Form.Item label={ __( 'Description' ) } labelFor="description" isRequired={ true } placement="beside">
    					<input
    						id="description"
    						type="text"
    						placeholder={ __( 'Description' ) }
    						value={ values.description }
    						onChange={ e => setValue( 'description', e.target.value ) }
    					/>
    				</Form.Item>
                </Form.Section>
			</Form>
		</Page>
	)
}
