import React, { Fragment, cloneElement, useContext, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { EmptyMessage, AppContext } from 'components'
import {
	ContentListContainer,
	ContentListGroupLabel,
	ContentListItem,
	ContentListItemLoading
} from './parts'
import './style.scss'

export const ContentList = ( {
	data = [],
	dataLoader = () => {},
	dataHasMore = false,
	container = <ContentListContainer />,
	containerClass = '',
	groupLabel = <ContentListGroupLabel />,
	item = <ContentListItem />,
	itemClass = '',
	itemClick = null,
	placeholderItem = <ContentListItemLoading />,
	placeholderItemCount = 10
} ) => {
	const [ requests ] = useState( [] )
	const appContext = useContext( AppContext )

	const loadItems = () => {
		requests.length && requests.pop().cancel()
		requests.push( dataLoader( data.length ) )
	}

	const renderItem = ( props, key ) => {
		return cloneElement( item, {
			className: itemClass,
			onClick: itemClick,
			data: props,
			key,
		} )
	}

	const renderItems = ( items ) => {
		return items.map( ( props, key ) => {
			if ( props.items ) {
				return (
					<Fragment key={ key }>
						{ cloneElement( groupLabel, { label: props.label } ) }
						{ renderItems( props.items ) }
					</Fragment>
				)
			}
			return renderItem( props, key )
		} )
	}

	const renderPlaceholderItems = () => {
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

	return (
		<InfiniteScroll
			getScrollParent={ () => appContext.scrollParent.current }
			hasMore={ dataHasMore }
			loadMore={ loadItems }
			loader={ renderPlaceholderItems() }
			threshold={ 500 }
			useWindow={ false }
		>
		{ cloneElement( container, { className: containerClass }, renderItems( data ) ) }
		</InfiniteScroll>
	)
}
