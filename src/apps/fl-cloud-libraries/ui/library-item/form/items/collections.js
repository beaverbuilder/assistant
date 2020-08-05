import React from 'react'
import { __ } from '@wordpress/i18n'
import { Form } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( {
	value,
	onChange,
	libraryId
} ) => {
	const [ collections, setCollections ] = cloud.libraries.useCollections( libraryId )

	if ( ! collections ) {
		return null
	}

	return (
		<Form.SuggestItem
			placeholder={ __( 'New Collection' ) }
			options={ [] }
			value={ [] }
			onRemove={ v => {
				console.log( v )
			} }
			onAdd={ name => {
				console.log( name )
			} }
		/>
	)
}
