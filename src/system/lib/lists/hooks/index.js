import { useState, useEffect } from 'fl-react'

const hasReachedBounds = e => {
	const el = e.target
	return el.scrollTop + el.clientHeight === el.scrollHeight
}

export const useScrollLoader = ( {
	ref = window,
	callback = () => {},
	shouldFetch = hasReachedBounds,
} ) => {
	const [ isFetching, setIsFetching ] = useState( false )
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
			callback( ( hasMore ) => {
				setHasMore( hasMore )
				setIsFetching( false )
			} )
		}
	}, [ isFetching ] )

	return {
		isFetching,
	}
}
