import React, { useState, useEffect, useRef } from 'fl-react'
import { List } from '../'

const hasReachedBounds = e => {
	const el = e.target
	return el.scrollTop + el.clientHeight === el.scrollHeight
}

export const useScrollLoader = ( {
	ref = window,
	callback = () => {},
	shouldFetch = hasReachedBounds,
} ) => {
	const [ isFetching, setIsFetching ] = useState( true )
	const [ hasMore, setHasMore ] = useState( true )

	useEffect( () => {
		if ( 'undefined' === ref.current ) {
			return
		}
		if ( hasMore && ! isFetching ) {
			const handleScroll = e => {
				if ( shouldFetch( e ) ) {
					setIsFetching( true )
				}
			}
			ref.current.addEventListener( 'scroll', handleScroll )
			return () => ref.current.removeEventListener( 'scroll', handleScroll )
		}
	}, [ isFetching, hasMore ] )

	useEffect( () => {
		if ( isFetching ) {
			const handleUnmount = callback( ( hasMore ) => {
				setHasMore( hasMore )
				setIsFetching( false )
			} )
			return () => handleUnmount && handleUnmount()
		}
	}, [ isFetching ] )

	return {
		isFetching,
	}
}

export const Scroller = ( {
	loadItems = () => {},
	...rest
} ) => {
	const scrollRef = useRef()
	const { isFetching } = List.useScrollLoader( {
		ref: scrollRef,
		callback: loadItems,
	} )

	return (
		<div className="fl-asst-list-scroller fl-asst-scroller" ref={scrollRef}>
			<List {...rest} />
			{ isFetching && <List.Loading /> }
		</div>
	)
}
