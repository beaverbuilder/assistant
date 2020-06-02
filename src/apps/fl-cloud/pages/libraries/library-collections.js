import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default ( { library } ) => {
	const [ collections ] = cloud.libraries.useCollections( library.id )
	const [ newCollection, setNewCollection ] = useState( '' )

	if ( ! collections ) {
		return <Page.Loading />
	}

	const addCollection = () => {
		if ( ! newCollection ) {
			return
		}
		cloud.libraries.createCollection( library.id, {
			name: newCollection
		} )
	}

	return (
		<Layout.Box>
			<Page.Section label={ __( 'Add New Collection' ) }>
				<input
					type='text'
					placeholder={ __( 'Collection Name' ) }
					value={ newCollection }
					onChange={ e => setNewCollection( e.target.value ) }
				/>
				<Button onClick={ addCollection }>{ __( 'Add New Collection' ) }</Button>
			</Page.Section>
		</Layout.Box>
	)
}
