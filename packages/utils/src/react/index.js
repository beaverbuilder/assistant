import { isValidElement, cloneElement } from 'react'

export const render = ( componentOrFunction, props = {} ) => {

	if ( isValidElement( componentOrFunction ) ) {

		return cloneElement( componentOrFunction, props )

	} else if ( 'function' === typeof componentOrFunction ) {

		const result = componentOrFunction( props )
		if ( isValidElement( result ) ) {
			return result
		}
	}
	return null
}
