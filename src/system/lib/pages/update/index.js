import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page } from 'lib'

export const Update = ( { location = {} } ) => {

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

	const item = 'undefined' !== typeof location.state.item ? location.state.item : defaultItem

	const { type, banner, title, content } = item

	const contentHTML = { __html: content }
	const pageType = 'plugin' === type ? __( 'Plugin' ) : __( 'Theme' )

	return (
		<Page shouldPadSides={ false } title={ pageType }>
			{ banner && <img src={ banner } /> }

			<Page.Pad>
				<h1>{title}</h1>
				<div dangerouslySetInnerHTML={ contentHTML } />
			</Page.Pad>
		</Page>
	)
}
