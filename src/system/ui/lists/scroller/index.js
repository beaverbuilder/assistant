import React, { useState, useEffect, useRef } from 'react'
import classname from 'classnames'
import { List } from '../'

const hasReachedBounds = e => {
	const { scrollTop, clientHeight, scrollHeight } = e.target
	const bottom = scrollTop + clientHeight
	return bottom + 150 >= scrollHeight
}

export const useScrollLoader = ( {
	ref = window,
	hasMore = true,
	callback = () => {},
	shouldFetch = hasReachedBounds,
} ) => {
	const [ isFetching, setIsFetching ] = useState( true )

	const reset = () => setIsFetching( true )

	useEffect( () => {
		if ( 'undefined' === typeof ref.current ) {
			return
		}
		if ( hasMore && ! isFetching ) {
			const handleScroll = e => {
				if ( shouldFetch( e ) ) {
					setIsFetching( true )
				}
			}
			ref.current.addEventListener( 'scroll', handleScroll )
			return () => {
				if ( ref.current ) {
					ref.current.removeEventListener( 'scroll', handleScroll )
				}
			}
		}
	}, [ isFetching, hasMore ] )

	useEffect( () => {
		if ( isFetching ) {
			callback( () => {
				setIsFetching( false )
			} )
		}
	}, [ isFetching ] )

	return {
		isFetching,
		reset,
	}
}

export const Scroller = ( {
	items = [],
	hasMoreItems = true,
	loadItems = () => {},
	before,
	after,
	scrollerClassName,
	noResultsMessage,
	endcap: EndCap = List.EndMessage,
	...rest
} ) => {
	const scrollRef = useRef()
	const { isFetching, reset } = List.useScrollLoader( {
		ref: scrollRef,
		hasMore: hasMoreItems,
		callback: loadItems,
	} )

	useEffect( () => {
		if ( 0 === items.length ) {
			reset()
		}
	}, [ items.length, hasMoreItems ] )

	const classes = classname( 'fl-asst-list-scroller fl-asst-scroller', scrollerClassName )

	return (
		<div className={ classes } ref={ scrollRef }>
			{before}
			<List items={ items } { ...rest } />
			{ isFetching && (
				<div style={ { minHeight: 100 } }>
					<List.Loading />
				</div>
			) }
			{ ! isFetching && ! hasMoreItems && ! items.length && (
				<div style={ { minHeight: 100 } }>
					<List.NoResultsMessage message={ noResultsMessage } />
				</div>
			)}
			{ false !== EndCap && ! isFetching && ! hasMoreItems && !! items.length && (
				<div style={ { minHeight: 100 } }>
					<EndCap />
				</div>
			)}
			{after}
		</div>
	)
}
