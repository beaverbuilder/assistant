import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form, Button } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

// Generic Actions Section
registerSection( 'fl-screen-actions', {
	label: __( 'Actions' ),
	location: {
		type: [ 'post', 'attachment', 'comment', 'plugin' ],
	},
	render: ( { actions } ) => {

		if ( 'undefined' === typeof actions || ( Array.isArray( actions ) && 1 > actions.length ) ) {
			return (
				<>{__( 'No Actions Available' )}</>
			)
		}

		return (
			<Form.Item>
				<Button.Group appearance="grid">
					{ Button.renderActions( actions ) }
				</Button.Group>
			</Form.Item>
		)
	},
} )
