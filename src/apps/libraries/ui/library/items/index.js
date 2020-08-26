import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries, Uploader } from '@beaverbuilder/cloud-ui'
import { Button, Layout } from 'assistant/ui'
import { useAppState, getAppHooks } from 'assistant/data'

import ItemsHeader from './header'
import ItemsFilter from './filter'
import ItemsUpload from '../upload'
import './style.scss'

const Wrapper = ( { library, onDrop, children } ) => {
	if ( library.permissions.edit_items ) {
		return (
			<Layout.DropArea onDrop={ onDrop }>
				{ children }
			</Layout.DropArea>
		)
	}
	return <div>{ children }</div>
}

export default () => {
	const {
		library,
		items,
		showUpload,
		uploader,
	} = Libraries.LibraryContext.use()

	const { defaultItemsFilter } = useAppState( 'libraries', 'defaultItemsFilter' )
	const { useItemsFilter } = getAppHooks( 'libraries' )
	const [ itemsFilter, setItemsFilter ] = useItemsFilter()
	const filteredItems = Libraries.getFilteredItems( itemsFilter, items )
	const hasItems = items && !! items.length

	const shouldShowNoResults = () => {
		const { view_by, type, collection } = itemsFilter
		if ( items && ! Object.keys( filteredItems ).length ) {
			if ( 'type' === view_by && 'all' !== type ) {
				return true
			} else if ( 'collection' === view_by && 'all' !== collection ) {
				return true
			}
		}
		return false
	}

	return (
		<Wrapper library={ library } onDrop={ uploader.handleDrop }>
			{ hasItems && <ItemsFilter /> }
			<ItemsHeader />
			{ showUpload && <ItemsUpload /> }
			{ !! uploader.queuedFiles.length &&
				<Layout.Box padY={ false }>
					<Uploader.FileList files={ uploader.queuedFiles } />
				</Layout.Box>
			}
			{ hasItems && <Libraries.ItemsList />}
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
		</Wrapper>
	)
}
