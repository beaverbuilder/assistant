import camelCase from 'camelcase'

/**
 * Creates default actions for state keys that do not
 * have a reducer.
 */
export const createActions = ( actions, reducers, state ) => {

	Object.entries( state ).map( ( [ key ] ) => {
		if ( ! reducers[ key ] ) {
			const type = `SET_${ key.toUpperCase() }`
			const action = camelCase( `set_${ key }` )
			actions[ action ] = value => ( { type, value } )
		}
	} )

	return actions
}
