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
				content: '',
				enabled: true,
				icon: null,
				label: 'Untitled App',
				size: 'normal',
				...action.config,
			},
			...state,
		}
	default:
		return state
	}
}

export const appState = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'REGISTER_APP':
		return {
			[ action.key ]: {},
			...state,
		}
	case 'HYDRATE_APP_STATE':
		return {
			...state,
			[ action.app ]: action.state,
		}
	case 'SET_APP_STATE':
		if ( 'object' === typeof action.key ) {
			return {
				...state,
				[ action.app ]: {
					...state[ action.app ],
					...action.key,
				},
			}
		}
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

export const isShowingUI = ( state = true, action ) => {
	switch ( action.type ) {
	case 'SET_SHOW_UI':
		return action.show ? true : false
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

export const appFrameSize = ( state = 'normal', action ) => {
	switch ( action.type ) {
	case 'SET_APP_FRAME_SIZE':
		return action.size
	default:
		return state
	}
}

export const shouldReduceMotion = ( state = false, action ) => {
	switch ( action.type ) {
	case 'SET_REDUCE_MOTION':
		return action.shouldReduce 
	default:
		return state
	}
}
