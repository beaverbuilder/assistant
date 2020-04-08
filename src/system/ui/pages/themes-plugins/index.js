import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Page, Layout } from 'ui'

export const Plugin = ( { location = {} } ) => {
	const { item } = location.state
	const {
		banner,
		title,
		content,
		author,
		authorURI,
		pluginURI
	} = item

	const { renderForm } = Form.useForm( {
		defaults: item,
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					version: {
						label: __( 'Current Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					updatedVersion: {
						label: __( 'Updated Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					author: {
						label: __( 'Author' ),
						labelPlacement: 'beside',
						component: () => authorURI ? <a href={ authorURI }>{author}</a> : author,
					},
					pluginURI: {
						label: __( 'Plugin Page' ),
						labelPlacement: 'beside',
						component: () => <a href={ pluginURI }>{title}</a>,
					},
					tested: {
						label: __( 'Tested for WordPress Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					requiresPHP: {
						label: __( 'Requires PHP Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					}
				}
			},
		}
	} )

	return (
		<Page title={ __( 'Plugin' ) } hero={ banner }>
			<Layout.Headline>{title}</Layout.Headline>
			<div dangerouslySetInnerHTML={ { __html: content } } />
			{renderForm()}
		</Page>
	)
}

export const Theme = ( { location = {} } ) => {
	const { item } = location.state
	const { banner, title, content } = item

	const { renderForm } = Form.useForm( {
		defaults: item,
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					version: {
						label: __( 'Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					updatedVersion: {
						label: __( 'Updated Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					},
					author: {
						label: __( 'Author' ),
						labelPlacement: 'beside',
						component: 'plain-text',
					}
				}
			}
		}
	} )

	return (
		<Page title={ __( 'Theme' ) } hero={ banner }>
			<Layout.Headline>{title}</Layout.Headline>
			<div dangerouslySetInnerHTML={ { __html: content } } />
			{renderForm()}
		</Page>
	)
}
