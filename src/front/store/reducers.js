import { combineReducers } from 'redux'

export function activeApp( state = {}, action ) {
	switch ( action.type ) {
		case 'SET_ACTIVE_APP':
			return action.key
		default:
			return state
	}
}

export function apps( state = {}, action ) {
	switch ( action.type ) {
		case 'REGISTER_APP':
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

export function showUI( state = {}, action ) {
	switch ( action.type ) {
		case 'SET_SHOW_UI':
			return action.show
		default:
			return state
	}
}

export default function( state = {}, action ) {

	const reducers = {
		activeApp,
		apps,
		showUI,
	}

	Object.entries( state ).map( ( [ key, value ] ) => {
		if ( ! reducers[ key ] ) {
			reducers[ key ] = ( state = value ) => state
		}
	} )

	return combineReducers( reducers )( state, action )
}
