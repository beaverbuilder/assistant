import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Control, Button } from 'lib'

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
	const defaultItem = {
		url: '',
		sizes: {},
		caption: '',
		description: '',
		alt: '',
		title: '',
		filesize: '',
	}
	const item = 'undefined' !== typeof location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem
	const srcSet = getSrcSet( item.sizes )

	const Actions = () => {
		return (
			<Control.NextPrev
				onPrev={ () => {} }
				onNext={ () => {} }
			/>
		)
	}

	return (
		<Page shouldPadSides={ false } title={ __( 'Attachment' ) } headerActions={ <Actions /> }>

			<img src={ item.thumbnail } srcSet={ srcSet } />

			<Form>
				<Page.RegisteredSections
					location={ { type: 'attachment' } }
					data={ { attachment: item } }
				/>

				<Form.Section label={ __( 'Actions' ) }>
					<Form.Item>
						<Button.Group appearance="grid">
							<Button>{__( 'View Attachment Page' )}</Button>
							<Button>{__( 'Edit in Admin' )}</Button>
							<Button>{__( 'Replace File' )}</Button>
							<Button>{__( 'Regenerate Thumbnails' )}</Button>
							<Button>{__( 'Move to Trash' )}</Button>
						</Button.Group>
					</Form.Item>
				</Form.Section>
			</Form>
		</Page>
	)
}
