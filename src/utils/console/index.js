import { useEffect } from 'react'

export const warn = ( message ) => {
	if ( console && console.warn ) { // eslint-disable-line no-console
		console.warn( message ) // eslint-disable-line no-console
	}
}

export const deprecate = ( oldFunc, newFunc ) => {
	let message = `${ oldFunc } has been deprecated.`
	if ( newFunc ) {
		message += ` Please use ${ newFunc }.`
	}
	warn( message )
}

const useLifecycles = ( mount, unmount ) => {
	useEffect( () => {
		if ( mount ) {
			mount()
		}
		return () => {
			if ( unmount ) {
				unmount()
			}
		}
	}, [] )
}

export const useLogger = ( name, props ) => {
	useLifecycles(
		() => console.log( `${name} mounted` ),
		() => console.log( `${name} un-mounted` )
	)
	useEffect( () => {
		console.log( `${name} props updated`, props )
	} )
}
