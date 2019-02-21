import React, { Fragment, cloneElement, useContext, useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { EmptyMessage, ItemContext, StackContext } from 'components'
import {
	ContentListContainer,
	ContentListEmptyMessage,
	ContentListGroupLabel,
	ContentListItem,
	ContentListItemLoading
} from './parts'
import './style.scss'

export const ContentList = ( {
	className = '',
	data = [],
	dataHasMore = false,
	dataLoader = () => {},
	dataSetter = () => {},
	container = <ContentListContainer />,
	emptyMessage = <ContentListEmptyMessage />,
	group = <ContentListGroupLabel />,
	item = <ContentListItem />,
	itemProps = {},
	placeholderItem = <ContentListItemLoading />,
	placeholderItemCount = 10
} ) => {
	const request = useRef()
	const { ref, updateCurrentView } = useContext( StackContext )

	console.log('stack ref', ref )

	useEffect( () => {
		return () => request.current && request.current.cancel()
	}, [] )

	/**
	 * Cancels an existing request and runs the data loader.
	 * Passed to the InfiniteScroll component.
	 */
	const loadItems = () => {
		if ( request.current ) {
			request.current.cancel()
		}
		request.current = dataLoader( data.length )
	}

	/**
	 * Checks an array to see if it has any valid items.
	 */
	const hasItems = ( items ) => {
		let itemsFound = false
		items.map( ( itemData ) => {
			if ( itemData && itemData.items ) {
				itemData.items.map( ( groupItem ) => {
					if ( groupItem ) {
						itemsFound = true
					}
				} )
			} else if ( itemData ) {
				itemsFound = true
			}
		} )
		return itemsFound
	}

	/**
	 * Updates an item with new data.
	 */
	const updateItem = ( itemKey, groupKey, newData ) => {
		const itemData = null === groupKey ? data[ itemKey ] : data[ groupKey ].items[ itemKey ]
		if ( null === groupKey ) {
			data[ itemKey ] = { ...itemData, ...newData }
			updateCurrentView( data[ itemKey ] )
		} else {
			data[ groupKey ].items[ itemKey ] = { ...itemData, ...newData }
			updateCurrentView( data[ groupKey ].items[ itemKey ] )
		}
		dataSetter( data.slice( 0 ) )
	}

	/**
	 * Removes an item by setting it to null to preserve keys.
	 */
	const removeItem = ( itemKey, groupKey ) => {
		if ( null === groupKey ) {
			data[ itemKey ] = null
		} else {
			data[ groupKey ].items[ itemKey ] = null
		}
		dataSetter( data.slice( 0 ) )
	}

	/**
	 * Renders a single item.
	 */
	const renderItem = ( itemData, itemKey, groupKey = null ) => {
		const context = {
			removeItem: () => removeItem( itemKey, groupKey ),
			updateItem: newData => updateItem( itemKey, groupKey, newData ),
			...itemData,
		}
		return (
			<ItemContext.Provider key={ itemKey } value={ context }>
				{ cloneElement( item, itemProps ) }
			</ItemContext.Provider>
		)
	}

	/**
	 * Renders all items in an array.
	 */
	const renderItems = ( items, groupKey = null ) => {
		return items.map( ( itemData, itemKey ) => {
			if ( itemData && itemData.items && hasItems( itemData.items ) ) {
				return (
					<Fragment key={ itemKey }>
						{ cloneElement( group, { label: itemData.label } ) }
						{ renderItems( itemData.items, itemKey ) }
					</Fragment>
				)
			} else if ( itemData && ! itemData.items ) {
				return renderItem( itemData, itemKey, groupKey )
			}
			return null
		} )
	}

	/**
	 * Renders the placeholder items for loading.
	 */
	const renderPlaceholderItems = () => {
		const count = data.length ? 1 : placeholderItemCount
		return Array( count ).fill().map( ( item, key ) => {
			return cloneElement( placeholderItem, { key } )
		} )
	}

	/**
	 * Nothing found! Show an empty message...
	 */
	if ( ! hasItems( data ) && ! dataHasMore ) {
		if ( 'string' === typeof emptyMessage ) {
			return <EmptyMessage>{ emptyMessage }</EmptyMessage>
		}
		return emptyMessage
	}

	/**
	 * Render the InfiniteScroll component and child items.
	 */
	return (
		<InfiniteScroll
			getScrollParent={ () => ref.current }
			hasMore={ dataHasMore }
			loadMore={ loadItems }
			loader={ renderPlaceholderItems() }
			threshold={ 500 }
			useWindow={ false }
		>
			{ cloneElement( container, { className }, renderItems( data ) ) }
		</InfiniteScroll>
	)
}
