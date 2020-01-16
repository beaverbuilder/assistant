import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'data'
import { Form, Button } from 'ui'

const { registerSection } = getSystemActions()

registerSection( 'fl-screen-labels', {
	location: {
		type: [ 'post' ],
	},
	render: ( { useFormData_Deprecated } ) => {
		const { labels } = useFormData_Deprecated()
		return (
			<Form.LabelsItem { ...labels } />
		)
	},
} )

registerSection( 'fl-screen-actions', {
	label: __( 'Actions' ),
	location: {
		type: [ 'post', 'attachment' ],
	},
	render: ( { useFormData_Deprecated } ) => {

		if ( 'undefined' === typeof useFormData_Deprecated ) {
			return null
		}

		const { actions } = useFormData_Deprecated()

		if ( 'undefined' === typeof actions || 1 > actions.length ) {
			return (
				<div>{__( 'No Actions Found' )}</div>
			)
		}

		return (
			<>
				<Form.Item label={ actions.label }>
					<Button.Group appearance="grid">
						{ Button.renderActions( actions.value ) }
					</Button.Group>
				</Form.Item>
			</>
		)
	},
} )
