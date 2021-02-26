import { useEffect, useRef } from 'react'

const hasReachedBounds = e => {
	const { scrollTop, clientHeight, scrollHeight } = e.target
	const bottom = scrollTop + clientHeight
	return bottom + 150 >= scrollHeight
}

const defaultOptions = {
	onScrollEnd: () => {},
	hasReachedBounds
}

const useScroller = ( _options = {} ) => {
	const { hasReachedBounds, onScrollEnd } = { ...defaultOptions, ..._options }
	const hasHitBoundary = useRef( false )
	const ref = useRef( null )

	useEffect( () => {

		if ( undefined === ref.current ) {
			return
		}

		const reset = () => hasHitBoundary.current = false

		const onScroll = e => {
			if ( hasReachedBounds( e ) && ! hasHitBoundary.current ) {
				hasHitBoundary.current = true
				onScrollEnd( reset )
			}
		}

		ref.current.addEventListener( 'scroll', onScroll )

		return () => ref.current.removeEventListener( 'scroll', onScroll )
	}, [] )

	return ref
}

export default useScroller
