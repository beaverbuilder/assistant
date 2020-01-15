import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'ui'
import { getSrcSet } from 'utils/image'

const getItemActions = ( { staticValues } ) => {

	const { url, editUrl } = staticValues

	return [
		{
			label: __( 'View Attachment' ),
			href: url,
		},
		{
			label: __( 'Edit in Admin' ),
			href: editUrl,
		},
	]
}

export const Attachment = ( { location } ) => {
	const { item } = location.state
	const srcSet = getSrcSet( item.sizes )

	// Form Handler
	const { form, useFormContext } = Form.useFormData_Deprecated( {
		title: {
			label: __( 'Title' ),
			labelPlacement: 'beside',
		},
		alt: {
			label: __( 'Alternative Text' ),
			labelPlacement: 'beside',
		},
		description: {
			type: 'textarea',
			label: __( 'Description' ),
			rows: 2,
		},
		caption: {
			type: 'textarea',
			label: __( 'Caption' ),
			rows: 2,
		},
		url: {
			label: __( 'URL' ),
		},
		actions: {
			value: getItemActions,
		},
	},
	{ /* options */ }, item )

	const sectionData = {
		attachment: item,

		useFormData_Deprecated: useFormContext,

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
	}

	const Hero = () => <img src={ item.thumbnail } srcSet={ srcSet } />

	return (
		<Page title={ __( 'Attachment' ) } hero={ <Hero /> }>

			<Form { ...form }>
				<Page.RegisteredSections
					location={ { type: 'attachment' } }
					data={ sectionData }
				/>
			</Form>
		</Page>
	)
}
