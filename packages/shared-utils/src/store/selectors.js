/**
 * Wraps all user defined selectors in a function that passes
 * in the current state as the first argument.
 */
export const createSelectors = ( selectors, store ) => {
	const wrapped = {}
	Object.entries( selectors ).map( ( [ key, selector ] ) => {
		wrapped[ key ] = ( ...args ) => selector( store.getState(), ...args )
	} )
	return wrapped
}
