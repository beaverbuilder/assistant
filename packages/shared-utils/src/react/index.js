import React, { Fragment, isValidElement } from 'fl-react'

// Check if a given prop (most likely children) is a function to be rendered
export const isRenderProp = children => typeof children === "function"

/**
 * Resove multiple kinds of vars to a valid component type
 *
 * @param component - Component | <Component /> | 'div' | () => Component
 * @return - a valid react component type
 */
/*
export const resolveComponent = ( component, args ) => { console.log('resolve', component, args )

	if ( isValidElement( component ) || 'string' === typeof component ) {
		return component

	} else if ( 'function' === typeof component ) {
		const result = component( args )
		if ( isValidElement( result ) || 'string' === typeof result ) {
			return result
		}
	}
	return Fragment
}*/
