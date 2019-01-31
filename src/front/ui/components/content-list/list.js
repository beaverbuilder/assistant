import React, { cloneElement, useContext, useState } from 'react'
import classname from 'classnames'
import InfiniteScroll from 'react-infinite-scroller'
import { EmptyMessage, CurrentTabContext } from 'components'
import { ContentListContainer, ContentListItem, ContentListItemLoading } from './parts'
import './style.scss'

export const ContentList = ( {
	data = [],
	dataLoader = () => {},
	dataHasMore = false,
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
	const [ requests, setRequests ] = useState( [] )
	const currentTab = useContext( CurrentTabContext )

	const loadItems = () => {
		requests.length && requests.pop().cancel()
		requests.push( dataLoader( data.length ) )
	}

	const getItems = () => {
		return (
			<InfiniteScroll
				getScrollParent={ () => currentTab.scrollParent.current }
				hasMore={ dataHasMore }
				loadMore={ loadItems }
				loader={ getPlaceholderItems() }
				threshold={ 500 }
				useWindow={ false }
			>
			{ data.map( ( props, key ) => {
				return cloneElement( item, {
					className: itemClass,
					key,
					itemThumb,
					itemMeta,
					itemActions,
					...props,
				} )
			} ) }
			</InfiniteScroll>
		)
	}

	const getPlaceholderItems = () => {
		const count = data.length ? 1 : placeholderItemCount
		return Array( count ).fill().map( ( item, key ) => {
			return cloneElement( placeholderItem, {
				className: itemClass,
				key,
			} )
		} )
	}

	if ( ! data.length && ! dataHasMore ) {
		return <EmptyMessage>No Results Found</EmptyMessage>
	}

	return cloneElement( container, { className: containerClass }, getItems() )
}
