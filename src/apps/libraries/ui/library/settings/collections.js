import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'

export default ( { library } ) => {
	const [ collections, setCollections ] = cloud.libraries.useCollections( library.id )
	const [ newCollection, setNewCollection ] = useState( '' )
	const [ editingCollection, setEditingCollection ] = useState( null )
	const [ loading, setLoading ] = useState( false )

	if ( ! collections ) {
		return <Page.Loading />
	}

	const addCollection = () => {
		if ( ! newCollection ) {
			return
		}
		setLoading( true )
		cloud.libraries.createCollection( library.id, {
			name: newCollection
		} ).then( response => {
			collections.push( response.data )
			setCollections( [ ...collections ] )
			setNewCollection( '' )
		} ).finally( () => {
			setLoading( false )
		} )
	}

	const editCollection = ( collection ) => {
		setEditingCollection( collection )
	}

	const updateCollection = ( collection ) => {
		const { id, name } = collection
		if ( ! name ) {
			return
		}
		collections.map( ( item, i ) => {
			if ( item.id === collection.id ) {
				collections[ i ] = collection
			}
		} )
		setCollections( [ ...collections ] )
		setEditingCollection( null )
		cloud.libraries.updateCollection( id, { name } )
	}

	const deleteCollection = ( collectionId ) => {
		if ( confirm( __( 'Do you really want to delete this collection?' ) ) ) {
			cloud.libraries.deleteCollection( collectionId )
			setCollections( collections.filter( collection => collection.id !== collectionId ) )
		}
	}

	const rows = collections.map( collection => {
		const { id, name } = collection

		if ( editingCollection && editingCollection.id === collection.id ) {
			return {
				edit: (
					<div style={ { display: 'flex' } }>
						<input
							type='text'
							value={ editingCollection.name }
							onChange={ e => {
								setEditingCollection( {
									...editingCollection,
									name: e.target.value,
								} )
							} }
						/>
						<Button
							onClick={ () => updateCollection( editingCollection ) }
							status="primary"
							style={ { marginLeft: 'var(--fluid-sm-space)' } }
						>
							{ __( 'Save' ) }
						</Button>
						<Button
							onClick={ () => setEditingCollection( null ) }
							style={ { marginLeft: 'var(--fluid-sm-space)' } }
						>
							{ __( 'Cancel' ) }
						</Button>
					</div>
				)
			}
		}

		return {
			name,
			actions: (
				<>
					<Button
						onClick={ () => editCollection( collection ) }
						title={ __( 'Edit Collection' ) }
					>
						<Icon.Edit />
					</Button>
					<Button
						onClick={ () => deleteCollection( id ) }
						status="destructive"
						title={ __( 'Delete Collection' ) }
						style={ { marginLeft: 'var(--fluid-sm-space)' } }
					>
						<Icon.Trash />
					</Button>
				</>
			)
		}
	} )

	return (
		<Layout.Box padY={ false }>
			<Page.Section label={ __( 'Library Collections' ) }>
				<Layout.Table rows={ rows } />
				<input
					type='text'
					placeholder={ __( 'Collection Name' ) }
					value={ newCollection }
					onChange={ e => setNewCollection( e.target.value ) }
				/>
				<Button.Loading
					onClick={ addCollection }
					isLoading={ loading }
				>
					{ __( 'Add New Collection' ) }
				</Button.Loading>
			</Page.Section>
		</Layout.Box>
	)
}
