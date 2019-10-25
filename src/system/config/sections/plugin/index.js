import React from 'react'
import { getSystemActions } from 'store'
import { Form } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-plugin-title', {
	location: {
		type: 'plugin',
	},
	render: ( { plugin } ) => {
		const contentHTML = { __html: plugin.content }
		return (
			<Form.Item>
				<h1>{plugin.title}</h1>
				<div dangerouslySetInnerHTML={ contentHTML } />
			</Form.Item>
		)
	},
} )

registerSection( 'fl-plugin-details', {
	label: __( 'Details' ),
	location: {
		type: 'plugin',
	},
	render: ( { plugin } ) => {
		return (
            <>
                <Form.Item label={ __( 'Version' ) } placement="beside">{plugin.version}</Form.Item>
                <Form.Item label={ __( 'Author' ) } placement="beside">{plugin.author}</Form.Item>
            </>
		)
	},
} )
