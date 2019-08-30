import camelCase from 'camelcase'

/**
 * Wraps all user defined selectors in a function that passes
 * in the current state as the first argument. Creates default
 * selectors for state keys without one.
 */
export const createSelectors = ( selectors, store ) => {
	const wrapped = {}
	const state = store.getState()

	Object.entries( state ).map( ( [ key ] ) => {
		const name = camelCase( `get_${ key }` )
		if ( ! selectors[ name ] ) {
			selectors[ name ] = currentState => currentState[ key ]
		}
	} )

	Object.entries( selectors ).map( ( [ key, selector ] ) => {
		wrapped[ key ] = ( ...args ) => selector( store.getState(), ...args )
	} )

	return wrapped
}
