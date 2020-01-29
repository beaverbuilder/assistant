import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'ui'
import { getSrcSet } from 'utils/image'
import { getWpRest } from 'utils/wordpress'

export const Attachment = ( { location } ) => {
	const { item } = location.state
	const srcSet = getSrcSet( item.sizes )
	const wpRest = getWpRest()

	const sections = {
		labels: {
			label: __( 'Labels' ),
			fields: {
				labels: {
					component: 'labels',
					alwaysCommit: true,
					onAdd: label => {
						wpRest.notations().createLabel( 'post', item.id, label.id )
					},
					onRemove: label => {
						wpRest.notations().deleteLabel( 'post', item.id, label.id )
					},
				},
			}
		},
		meta: {
			label: __( 'Metadata' ),
			fields: {
				title: {
					label: __( 'Title' ),
				},
				alt: {
					label: __( 'Alternative Text' ),
				},
				description: {
					label: __( 'Description' ),
					component: 'textarea',
					rows: 4,
				},
			},
		},
		links: {
			label: __( 'Links' ),
			fields: {
				fileUrl: {
					label: __( 'File URL' ),
					component: 'url',
					isVisible: !! item.sizes.full,
				},
				url: {
					label: __( 'URL' ),
					component: 'url',
				},
			},
		},
		actions: {
			label: __( 'Actions' ),
			fields: {
				actions: {
					component: 'actions',
					options: [
						{
							label: __( 'View Attachment' ),
							href: item.url,
						},
						{
							label: __( 'Edit in Admin' ),
							href: item.editUrl,
						},
					]
				}
			}
		}
	}

	const defaults = {
		...item,
		fileUrl: item.sizes.full ? item.sizes.full.url : null,
	}

	const { renderForm } = Form.useForm( {
		sections,
		defaults,
	} )

	const Hero = () => <img src={ item.thumbnail } srcSet={ srcSet } />

	return (
		<Page title={ __( 'Attachment' ) } hero={ <Hero /> }>
			{ renderForm() }
		</Page>
	)
}
