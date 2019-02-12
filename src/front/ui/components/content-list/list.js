import React, { Fragment, cloneElement, useContext, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { StackContext } from 'components'
import {
	ContentListContainer,
	ContentListEmptyMessage,
	ContentListGroupLabel,
	ContentListItem,
	ContentListItemLoading
} from './parts'
import './style.scss'

export const ContentList = ( {
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
	const [ requests ] = useState( [] )
	const stackContext = useContext( StackContext )

	/**
	 * Cancels an existing request and runs the data loader.
	 * Passed to the InfiniteScroll component.
	 */
	const loadItems = () => {
		if ( requests.length ) {
			requests.pop().cancel()
		}
		requests.push( dataLoader( data.length ) )
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
		const itemData = isNaN( groupKey ) ? data[ itemKey ] : data[ groupKey ].items[ itemKey ]
		if ( isNaN( groupKey ) ) {
			data[ itemKey ] = { ...itemData, ...newData }
		} else {
			data[ groupKey ].items[ itemKey ] = { ...itemData, ...newData }
		}
		dataSetter( data )
	}

	/**
	 * Removes an item by setting it to null to preserve keys.
	 */
	const removeItem = ( itemKey, groupKey ) => {
		if ( isNaN( groupKey ) ) {
			data[ itemKey ] = null
		} else {
			data[ groupKey ].items[ itemKey ] = null
		}
		dataSetter( data )
	}

	/**
	 * Renders a single item.
	 */
	const renderItem = ( itemData, itemKey, groupKey = null ) => {
		return cloneElement( item, {
			data: itemData,
			key: itemKey,
			removeItem: () => removeItem( itemKey, groupKey ),
			updateItem: newData => updateItem( itemKey, groupKey, newData ),
			...itemProps
		} )
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
		return emptyMessage
	}

	/**
	 * Render the InfiniteScroll component and child items.
	 */
	return (
		<InfiniteScroll
			getScrollParent={ () => stackContext.ref.current }
			hasMore={ dataHasMore }
			loadMore={ loadItems }
			loader={ renderPlaceholderItems() }
			threshold={ 500 }
			useWindow={ false }
		>
			{ cloneElement( container, {}, renderItems( data ) ) }
		</InfiniteScroll>
	)
}
