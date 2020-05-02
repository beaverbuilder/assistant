import { combineReducers } from 'redux'

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

	const reducer = combineReducers( reducers )

    // Wrap in a root reducer to handle the generated key/val action in getHooks
    return ( state, action ) => {

        if ( 'SET_VALUE_FOR_KEY' === action.type ) {
            return {
                ...state,
                [action.key]: action.value
            }
        }

        return reducer( state, action )
    }
}
