import { combineReducers } from 'redux'

/**
 * Creates default reducers for state keys that do not
 * have a reducer. Returns all reducers using combineReducers.
 */
export const createReducers = ( reducers, state ) => {

	Object.entries( state ).map( ( [ key, value ] ) => {
		if ( ! reducers[ key ] ) {
			reducers[ key ] = ( state = value, action ) => {
				switch ( action.type ) {
				case `SET_${ key.toUpperCase() }`:
					return action.value
				default:
					return state
				}
			}
		}
	} )

	return combineReducers( reducers )
}
