import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Page, Layout } from 'ui'

export const Plugin = ( { location = {} } ) => {
	const { item } = location.state
	const { banner, title, version, content } = item

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
					}
				}
			}
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
	const { banner, title, content, version } = item

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
