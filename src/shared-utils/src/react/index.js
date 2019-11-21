import { useEffect, useRef } from 'react'

/**
 * Check if a given prop (most likely children) is a function to be rendered.
 */
export const isRenderProp = children => 'function' === typeof children

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

/**
 * Hook to create a ref and call focus on it when the component mounts.
 * Allows for a callback to be passed that recieves the HTMLElement as an argument.
 * If false is returned from callback, focus is prevented. Good for overrides.
 */
export const useInitialFocus = ( callback = () => {} ) => {
	const ref = useRef()

	useEffect( () => {
		if ( ref.current && ref.current instanceof Element ) {
			if ( false !== callback( ref.current ) ) {
				ref.current.focus()
			}
		}
	}, [ ref ] )

	return ref
}
