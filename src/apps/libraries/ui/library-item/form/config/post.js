import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { getWpRest } from 'assistant/utils/wordpress'

export const getActions = ( item, actions ) => {
	const [ previewing, setPreviewing ] = useState( false )
	const postsApi = getWpRest().posts()

	const previewPost = () => {
		setPreviewing( true )
		postsApi.previewLibraryPost( item.id ).then( response => {
			setPreviewing( false )
			window.open( response.data.url )
		} )
	}

	actions.push( {
		component: <CreateButton item={ item } />
	} )

	actions.push( {
		label: __( 'Preview' ),
		onClick: previewPost,
		disabled: previewing,
	} )

	return actions
}

const CreateButton = ( { item } ) => {
	const history = useHistory()
	const { createNotice } = Libraries.ItemContext.use()
	const [ action, setAction ] = useState( null )
	const postsApi = getWpRest().posts()

	const createPost = ( action ) => {
		setAction( action )
		postsApi.importFromLibrary( item.id ).then( response => {
			if ( 'create' === action ) {
				createPostComplete( response )
			} else {
				importPostComplete( response )
			}
			setAction( null )
		} )
	}

	const createPostComplete = ( response ) => {
		const { type } = item.data.builder
		const { bbEditUrl, editUrl } = response.data

		if ( 'beaver-builder' === type && bbEditUrl ) {
			window.location.href = bbEditUrl
		} else {
			window.location.href = editUrl
		}
	}

	const importPostComplete = ( response ) => {
		if ( response.data.error ) {
			createNotice( {
				status: 'error',
				content: __( 'Error importing content.' )
			} )
		} else {
			createNotice( {
				status: 'success',
				content: (
					<>
						{ __( 'Content imported!' ) }
						<a
							style={ {
								textDecoration: 'underline',
								marginLeft: 'var(--fluid-sm-space)'
							} }
							onClick={ () => {
								history.push( `/fl-content/post/${ response.data.id }`, {
									item: response.data
								} )
							} }
						>
							{ __( 'View content.' ) }
						</a>
					</>
				)
			} )
		}
	}

	return (
		<>
			<select
				value={ '' }
				onChange={ e => createPost( e.target.value ) }
				disabled={ action }
			>
				<option value=''>
					{ ! action && __( 'Create New...' ) }
					{ 'create' === action && __( 'Creating...' ) }
					{ 'import' === action && __( 'Importing...' ) }
				</option>
				<option value='create'>{ __( 'Create and Edit' ) }</option>
				<option value='import'>{ __( 'Import' ) }</option>
			</select>
		</>
	)
}
