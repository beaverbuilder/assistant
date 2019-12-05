import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form } from 'ui'
import { Page } from 'fluid/ui'

export const Plugin = ( { location = {} } ) => {

	const defaultItem = {
		author: null,
		banner: null,
		content: null,
		key: null,
		meta: null,
		metaUpdated: null,
		plugin: null,
		thumbnail: null,
		title: null,
		type: 'plugin',
		version: null,
	}

	const item = undefined !== location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem

	const { banner, title, version, content } = item

	const sectionData = {
		plugin: item,
		actions: [
			{
				label: __( 'Update' ),
				onClick: () => {},
			},
			{
				label: __( 'Deactivate' ),
				onClick: () => {},
			},
		]
	}

	const { renderForm } = Form.useForm({
		sections: {
			details: {
				label: __('Details'),
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
	})

	return (
		<Page title={ __( 'Plugin' ) } hero={banner}>
			<Page.Headline>{title}</Page.Headline>
			<div dangerouslySetInnerHTML={{ __html: content }} />
			{renderForm()}
		</Page>
	)
}

export const Theme = ( { location = {} } ) => {

	const defaultItem = {
		author: null,
		banner: null,
		content: null,
		key: null,
		meta: null,
		metaUpdated: null,
		plugin: null,
		thumbnail: null,
		title: null,
		type: 'theme',
		version: null,
	}

	const item = 'undefined' !== typeof location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem

	const { banner, title, content, version } = item

	const sectionData = {
		plugin: item,
		actions: [
			{
				label: __( 'Update' ),
				onClick: () => {},
			},
			{
				label: __( 'Deactivate' ),
				onClick: () => {},
			},
		]
	}

	const { renderForm } = Form.useForm({
		sections: {
			details: {
				label: __('Details'),
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
	})

	return (
		<Page title={ __( 'Plugin' ) } hero={banner}>
			<Page.Headline>{title}</Page.Headline>
			<div dangerouslySetInnerHTML={{ __html: content }} />
			{renderForm()}
		</Page>
	)
}
