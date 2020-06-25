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
