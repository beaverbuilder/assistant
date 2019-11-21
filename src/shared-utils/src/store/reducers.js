import { combineReducers } from 'fl-redux'

/**
 * Creates default reducers for state keys that do not
 * have a reducer. Returns all reducers using combineReducers.
 */
export const createReducers = ( reducers, state ) => {

	/**
	 * Return a simple reducer if we don't have reducers and state.
	 * If this isn't done, Redux will throw an error.
	 */
	if ( ! Object.keys( reducers ).length && ! Object.keys( state ).length ) {
		return state => state
	}

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
