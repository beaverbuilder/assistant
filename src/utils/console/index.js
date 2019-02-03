export const warn = ( message ) => {
	if ( console && console.warn ) {
		console.warn( message )
	}
}

export const deprecate = ( oldFunc, newFunc ) => {
	let message = `${ oldFunc } has been deprecated.`
	if ( newFunc ) {
		message += `Please use ${ newFunc }.`
	}
	warn( message )
}
