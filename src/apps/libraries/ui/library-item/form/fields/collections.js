import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( {
	value,
	onChange,
	libraryId
} ) => {
	const [ collections ] = cloud.libraries.useCollections( libraryId )
	const options = []

	if ( ! collections ) {
		return null
	}

	collections.map( collection => {
		options[ collection.name ] = collection.name
	} )

	const addCollection = ( name ) => {
		const newValue = [ ...value ]

		if ( ! name ) {
			return
		}
		if ( ! newValue.includes( name ) ) {
			newValue.push( name )
		}

		onChange( newValue )
	}

	const removeCollection = ( name ) => {
		const newValue = [ ...value ]
		newValue.splice( newValue.indexOf( name ), 1 )
		onChange( newValue )
	}

	return (
		<Form.SuggestItem
			placeholder={ __( 'New Collection' ) }
			options={ options }
			value={ value }
			onAdd={ addCollection }
			onRemove={ removeCollection }
		/>
	)
}
