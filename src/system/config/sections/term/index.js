import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-term-details', {
	label: __( 'Basic Info' ),
	location: {
		type: 'term',
	},
	render: () => {
		return (
            <>
                <Form.Item label={ __( 'Test' ) } placement="beside">Test</Form.Item>
            </>
		)
	},
} )
