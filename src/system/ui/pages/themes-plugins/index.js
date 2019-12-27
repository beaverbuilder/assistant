import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Page, Layout } from 'ui'

export const Plugin = ( { location = {} } ) => {
	const { item } = location.state
	const { banner, title, version, content } = item

	const { renderForm } = Form.useForm( {
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					version: {
						label: __( 'Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
						value: version,
					}
				}
			}
		}
	} )

	return (
		<Page.NewPage title={ __( 'Plugin' ) } hero={ banner }>
			<Layout.Headline>{title}</Layout.Headline>
			<div dangerouslySetInnerHTML={ { __html: content } } />
			{renderForm()}
		</Page.NewPage>
	)
}

export const Theme = ( { location = {} } ) => {
	const { item } = location.state
	const { banner, title, content, version } = item

	const { renderForm } = Form.useForm( {
		sections: {
			details: {
				label: __( 'Details' ),
				fields: {
					version: {
						label: __( 'Version' ),
						labelPlacement: 'beside',
						component: 'plain-text',
						value: version,
					}
				}
			}
		}
	} )

	return (
		<Page.NewPage title={ __( 'Theme' ) } hero={ banner }>
			<Layout.Headline>{title}</Layout.Headline>
			<div dangerouslySetInnerHTML={ { __html: content } } />
			{renderForm()}
		</Page.NewPage>
	)
}
