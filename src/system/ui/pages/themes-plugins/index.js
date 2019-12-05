import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'ui'

export const Plugin = ( { location = {} } ) => {
	const { item } = location.state
	const { banner } = item

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

	return (
		<Page title={ __( 'Plugin' ) }>
			{ banner && <img src={ banner } /> }

			<Form>
				<Page.RegisteredSections
					location={ { type: 'plugin' } }
					data={ sectionData }
				/>
			</Form>
		</Page>
	)
}

export const Theme = ( { location = {} } ) => {
	const { item } = location.state
	const { banner } = item

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

	return (
		<Page shouldPadSides={ false } title={ __( 'Theme' ) }>
			{ banner && <img src={ banner } /> }

			<Form>
				<Page.RegisteredSections
					location={ { type: 'plugin' } }
					data={ sectionData }
				/>
			</Form>
		</Page>
	)
}
