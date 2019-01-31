import { combineReducers } from 'redux'

export const activeApp = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'SET_ACTIVE_APP':
		return action.key
	default:
		return state
	}
}

export const apps = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'REGISTER_APP':
		return {
			[ action.key ]: {
				app: action.key,
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

export const appState = ( state = {}, action ) => {
	const { config } = action
	switch ( action.type ) {
	case 'REGISTER_APP':
		return {
			[ action.key ]: config.state,
			...state,
		}
	case 'HYDRATE_APP_STATE':
		return {
			...state,
			[ action.app ]: action.state,
		}
	case 'SET_APP_STATE':
		return {
			...state,
			[ action.app ]: {
				...state[ action.app ],
				[ action.key ]: action.value,
			},
		}
	default:
		return state
	}
}

export const isShowingUI = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'SET_SHOW_UI':
		return action.show
	default:
		return state
	}
}

export const panelPosition = ( state = 'end', action ) => {
	switch ( action.type ) {
	case 'TOGGLE_PANEL_POSITION':
		return 'start' === state ? 'end' : 'start'
	case 'SET_PANEL_POSITION':
		return action.position
	default:
		return state
	}
}

export default ( state = {}, action ) => {

	const reducers = {
		activeApp,
		apps,
		appState,
		isShowingUI,
		panelPosition,
	}

	Object.entries( state ).map( ( [ key, value ] ) => {
		if ( ! reducers[ key ] ) {
			reducers[ key ] = ( state = value ) => state
		}
	} )

	return combineReducers( reducers )( state, action )
}
