import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Form, Control } from 'lib'

/**
 * Get a srcset string from an object of sizes.
 * Expects size.url and size.width to be present.
 */
const getSrcSet = ( sizes = {} ) => {
	return Object.values( sizes ).map( size => {
		return size.url + ' ' + size.width + 'w'
	} ).join( ', ' )
}

export const Attachment = ( { location, match, history } ) => {
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

	const sectionData = {
		attachment: item,
		actions: [
			{
				label: __( 'View Attachment Page' ),
				href: '#'
			},
			{
				label: __( 'Edit in Admin' ),
				href: '#'
			},
			{
				label: __( 'Replace File' ),
				onClick: () => {}
			},
			{
				label: __( 'Refresh Thumbnails' ),
				onClick: () => {}
			},
			{
				label: __( 'Move to Trash' ),
				onClick: () => {}
			},
		],
		nav: { location, match, history },
	}

	return (
		<Page shouldPadSides={ false } title={ __( 'Attachment' ) } headerActions={ <Actions /> }>

			<img src={ item.thumbnail } srcSet={ srcSet } />

			<Form>
				<Page.RegisteredSections
					location={ { type: 'attachment' } }
					data={ sectionData }
				/>
			</Form>
		</Page>
	)
}
