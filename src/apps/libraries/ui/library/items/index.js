import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Selection } from '@beaverbuilder/fluid'
import { Button, Layout, Icon } from 'assistant/ui'
import { useAppState, getAppHooks } from 'assistant/data'
import cloud from 'assistant/cloud'

import ItemUpload from '../upload'
import ItemsHeader from '../header'
import ItemsFilter from './filter'
import './style.scss'

const Wrapper = ( { children, ...rest } ) => {
	const { isReadOnly, library, uploader } = Libraries.LibraryContext.use()

	if ( ! isReadOnly && library.permissions.edit_items ) {
		return (
			<Layout.DropArea onDrop={ uploader.handleDrop } { ...rest }>
				{ children }
			</Layout.DropArea>
		)
	}
	return <div { ...rest }>{ children }</div>
}

export default () => {
	const { items, setItems, showUpload } = Libraries.LibraryContext.use()
	const { defaultItemsFilter } = useAppState( 'libraries', 'defaultItemsFilter' )
	const { useItemsFilter } = getAppHooks( 'libraries' )
	const [ itemsFilter, setItemsFilter ] = useItemsFilter()
	const filteredItems = Libraries.getFilteredItems( itemsFilter, items )
	const hasItems = items && !! items.length
	const { isSelecting, items: selectedItems, clearSelection, totalSelectedItems } = Selection.use()

	const shouldShowNoResults = () => {
		const { viewBy, type, collection } = itemsFilter
		if ( items && ! Object.keys( filteredItems ).length ) {
			if ( 'type' === viewBy && 'all' !== type ) {
				return true
			} else if ( 'collection' === viewBy && 'all' !== collection ) {
				return true
			}
		}
		return false
	}

	const DeleteSelectedItemsButton = () => {
		const { items: libItems, setItems } = Libraries.LibraryContext.use()

		const deleteItems = async ( ids = [] ) => {
			cloud.libraries.deleteItem( ids ).finally( () => {
				setItems( [ ...items.filter( obj => ! selectedItems.includes( obj.id ) ) ] )
				clearSelection()
			} )
		}
		return (
			<Button
				status="destructive"
				icon={ <Icon.Trash /> }
				disabled={ 0 >= totalSelectedItems }
				onClick={ () => {
					if ( confirm( __( 'Do you really want to delete these items?' ) ) ) {
						deleteItems( selectedItems )
					}
				} }
			>
				{ __( 'Delete' ) }
			</Button>
		)
	}

	return (
		<Wrapper className="fl-asst-library-content">

			{ ! isSelecting && hasItems && <ItemsFilter /> }
			{ isSelecting && (
				<Selection.Toolbar style={ { minHeight: 48, flexBasis: 48 } }>
					<DeleteSelectedItemsButton />
				</Selection.Toolbar>
			) }

			<Selection.Box
				itemSelector=".fluid-collection-item"
				mapElementToData={ el => parseInt( el.dataset.selectionId ) }
			>
				<ItemsHeader />
				<ItemUpload />
				{ hasItems && <Libraries.ItemsList /> }
				{ shouldShowNoResults() && ! showUpload &&
					<>
						<Layout.Box style={ { textAlign: 'center' } }>
							{ __( 'No results found.' ) }
						</Layout.Box>
						<Layout.Row>
							<Button onClick={ () => setItemsFilter( defaultItemsFilter ) }>
								{ __( 'Reset Filter' ) }
							</Button>
						</Layout.Row>
					</>
				}
				{ items && ! hasItems && ! showUpload &&
					<Layout.Box style={ { textAlign: 'center' } }>
						{ __( 'This library doesn\'t have any items yet.' ) }
					</Layout.Box>
				}
			</Selection.Box>
		</Wrapper>
	)
}
