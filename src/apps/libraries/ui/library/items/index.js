import React, { useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Layout } from 'assistant/ui'
import { useAppState, getAppHooks } from 'assistant/data'

import ItemsHeader from './header'
import ItemsFilter from './filter'
import ItemsUpload from '../upload'
import './style.scss'

export default () => {
	const {
		items,
		showUpload,
		onDrop,
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
		<Layout.DropArea onDrop={ onDrop }>
			{ hasItems && <ItemsFilter /> }
			<ItemsHeader />
			{ showUpload && <ItemsUpload /> }
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
		</Layout.DropArea>
	)
}
