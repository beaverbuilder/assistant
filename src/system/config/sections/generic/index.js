import React from 'fl-react'
import { getSystemActions } from 'store'
import { Form, Button, Control } from 'lib'
import { __ } from '@wordpress/i18n'

const { registerSection } = getSystemActions()

registerSection( 'fl-screen-labels', {
	label: __( 'Labels' ),
	location: {
		type: [ 'post' ],
	},
	render: ( { useForm } ) => {

		const { labels } = useForm()

		return (
			<>
				<Form.Item label={ __( 'Mark as Favorite' ) } placement="beside">
					<Button>{__( 'Favorite' )}</Button>
				</Form.Item>

				<Form.Item label={ labels.label }>
					<Control.TagGroup value={ labels.value } />
				</Form.Item>
			</>
		)
	},
} )

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
