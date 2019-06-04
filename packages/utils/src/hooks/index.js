import { useEffect, useRef } from 'fl-react'

/**
 * Like useEffect but only fires on component update.
 */
export const useComponentUpdate = ( callback, compare = [] ) => {
	const mounted = useRef()
	useEffect( () => {
		if ( ! mounted.current ) {
			mounted.current = true
		} else {
			callback()
		}
	}, compare )
}
