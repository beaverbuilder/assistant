import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'lib'

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

	const item = 'undefined' !== typeof location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem

	const { banner } = item

	const sectionData = {
		plugin: item,
		actions: [
			{
				label: __('Update'),
				onClick: () => {},
			},
			{
				label: __('Deactivate'),
				onClick: () => {},
			},
		]
	}

	return (
		<Page shouldPadSides={ false } title={ __( 'Plugin' ) }>
			{ banner && <img src={ banner } /> }

			<Form>
				<Page.RegisteredSections
					location={ { type: 'plugin' } }
					data={sectionData}
				/>
			</Form>
		</Page>
	)
}
