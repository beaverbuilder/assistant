import React, { useEffect, useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'shared-utils/wordpress'
import { getSystemActions } from 'store'
import { Form, Button, Control } from 'lib'

const { registerSection } = getSystemActions()

registerSection( 'fl-screen-labels', {
	label: __( 'Labels' ),
	location: {
		type: [ 'post' ],
	},
	render: ( { useForm } ) => {
		const [ options, setOptions ] = useState( {} )
		const { labels } = useForm()
		const wpRest = getWpRest()

		useEffect( () => {
			wpRest.labels().findWhere( {} ).then( response => {
				response.data.map( label => {
					options[ label.slug ] = label.label
				} )
				setOptions( { ...options } )
			} )
		}, [] )

		return (
			<Form.Item label={ labels.label }>
				<Control.TagGroup options={ options } value={ [ 'red', 'blue', 'green' ] } />
			</Form.Item>
		)
	},
} )

registerSection( 'fl-screen-actions', {
	label: __( 'Actions' ),
	location: {
		type: [ 'post', 'attachment' ],
	},
	render: ( { useForm } ) => {

		if ( 'undefined' === typeof useForm ) {
			return null
		}

		const { actions } = useForm()

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
