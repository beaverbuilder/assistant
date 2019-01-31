import React, { cloneElement, useContext, useState } from 'react'
import classname from 'classnames'
import InfiniteScroll from 'react-infinite-scroller'
import { EmptyMessage, CurrentTabContext, UIContext } from 'components'
import { ContentListContainer, ContentListItem, ContentListItemLoading } from './parts'
import './style.scss'

export const ContentList = ( {
	data = null,
	dataLoader = () => {},
	dataHasMore = true,
	container = <ContentListContainer />,
	containerClass = '',
	item = <ContentListItem />,
	itemClass = '',
	itemThumb = true,
	itemMeta = true,
	itemActions = true,
	placeholderItem = <ContentListItemLoading />,
	placeholderItemCount = 10
} ) => {
	const currentTab = useContext( CurrentTabContext )

	const getItems = () => {
		return data.map( ( props, key ) => {
			return cloneElement( item, {
				className: itemClass,
				key,
				itemThumb,
				itemMeta,
				itemActions,
				...props,
			} )
		} )
	}

	const getPlaceholderItems = ( count = placeholderItemCount ) => {
		return Array( count ).fill().map( ( item, key ) => {
			return cloneElement( placeholderItem, {
				className: itemClass,
				key,
			} )
		} )
	}

	const getInfiniteScroller = () => {
		return (
			<InfiniteScroll
				getScrollParent={ () => currentTab.scrollParent.current }
				hasMore={ dataHasMore }
				loadMore={ dataLoader }
				loader={ getPlaceholderItems( 1 ) }
				threshold={ 500 }
				useWindow={ false }
			>
				{ getItems() }
			</InfiniteScroll>
		)
	}

	if ( ! data ) {
		return getPlaceholderItems()
	} else if ( ! data.length ) {
		return <EmptyMessage>No Results Found</EmptyMessage>
	}

	return cloneElement( container, {
			className: containerClass
		},
		dataLoader ? getInfiniteScroller() : getItems()
	)
}
