import React from 'react'
import { __ } from '@wordpress/i18n'
import { useLocation } from 'react-router-dom'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Selection } from '@beaverbuilder/fluid'
import { Button, Layout } from 'assistant/ui'
import { useAppState, getAppHooks } from 'assistant/data'

import ItemUpload from '../upload'
import ItemsHeader from '../header'
import ItemsFilter from './filter'
import DeleteButton from './actions/delete'
import ImportButton from './actions/import'
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

/**
 * Check if a string ends with any of the possible endings.
 *
 * @param String str - the string to test for endings
 * @param [String] options - an array of possible ending strings
 * @return bool
 */
const endsWith = ( str, options = [] ) => options.some( option => str.endsWith( option ) )

export default () => {
	const location = useLocation()
	const { items, showUpload, library } = Libraries.LibraryContext.use()
	const { defaultItemsFilter } = useAppState( 'libraries', 'defaultItemsFilter' )
	const { useItemsFilter } = getAppHooks( 'libraries' )
	const [ itemsFilter, setItemsFilter ] = useItemsFilter()
	const filteredItems = Libraries.getFilteredItems( itemsFilter, items )
	const hasItems = items && !! items.length
	const { isSelecting } = Selection.use()

	const isSelectionEnabled = (
		library.permissions.edit_items &&
		! endsWith( location.pathname, [ '/share', '/settings', '/collections' ] )
	)

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

	return (
		<Wrapper className="fl-asst-library-content">

			<div className="fl-asst-library-sticky">
				<ItemsFilter />

				{ isSelecting && (
					<Selection.Toolbar style={ { minHeight: 48, flexBasis: 48, width: '100%', top: 'auto' } } isSticky={ false } >
						<ImportButton />
						<DeleteButton />
					</Selection.Toolbar>
				) }
			</div>

			<Selection.Box
				itemSelector=".fluid-collection-item"
				mapElementToData={ el => parseInt( el.dataset.selectionId ) }
				isEnabled={ isSelectionEnabled }
			>
				<ItemsHeader />
				<ItemUpload />
				<Libraries.ItemsList />
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
