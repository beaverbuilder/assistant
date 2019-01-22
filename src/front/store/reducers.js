import { combineReducers } from 'redux'

export function apps( state = {}, action ) {
	switch ( action.type ) {
		case 'ADD_APP':
			return {
				[ action.key ]: {
					label: 'Untitled App',
					content: '',
					icon: null,
					showTabIcon: true,
					...action.config,
				},
				...state,
			}
		default:
			return state
	}
}

export default function( state = {}, action ) {

	const reducers = { apps }

	Object.entries( state ).map( ( [ key, value ] ) => {
		if ( ! reducers[ key ] ) {
			reducers[ key ] = ( state = value ) => state
		}
	} )

	return combineReducers( reducers )( state, action )
}
