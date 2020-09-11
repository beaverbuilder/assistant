import React from 'react'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button, Layout } from 'assistant/ui'
import { useAppState, getAppHooks } from 'assistant/data'

import ItemUpload from '../upload'
import ItemsHeader from './header'
import ItemsFilter from './filter'
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
		<Wrapper library={ library } onDrop={ uploader.handleDrop }>
			{ hasItems && <ItemsFilter /> }
			<ItemsHeader />
			<ItemUpload />
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
