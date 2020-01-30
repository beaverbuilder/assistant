import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'ui'
import { getSrcSet } from 'utils/image'
import { getWpRest } from 'utils/wordpress'

export const Attachment = ( { location } ) => {
	const { item } = location.state
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

	const Hero = () => {
		const { width, sizes, height, alt } = item
		const srcSet = getSrcSet( sizes )
		const heightPercentage = ( height / width ) * 100

		const style = {
			position: 'relative',
			boxSizing: 'border-box',
			paddingTop: heightPercentage ? heightPercentage + '%' : '50%',
			background: 'var(--fluid-primary-background)'
		}

		return (
			<div style={style}>
				<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
					<img
						src={ item.thumbnail }
						srcSet={ srcSet }
						height={height}
						width={width}
						alt={alt}
						loading="lazy"
					/>
				</div>
			</div>
		)
	}

	return (
		<Page title={ __( 'Attachment' ) } hero={ <Hero /> }>
			{ renderForm() }
		</Page>
	)
}
