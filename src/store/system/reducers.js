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

export const shouldReduceMotion = ( state = false, action ) => {
	switch ( action.type ) {
	case 'SET_SHOULD_REDUCE_MOTION':
		return action.shouldReduce
	default:
		return state
	}
}

export const activeApp = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'SET_ACTIVE_APP':
		return action.key
	default:
		return state
	}
}

export const apps = ( state = {}, action ) => {

	const defaults = {
		app: null,
		label: null,
		content: null,
		newContent: null,
		enabled: true,
		icon: null,
		appearance: 'normal',
		state: {},
		actions: {},
		reducers: {},
		effects: {},
	}

	switch ( action.type ) {
	case 'REGISTER_APP':
		return {
			[ action.key ]: {
				...defaults,
				app: action.key,
				label: action.key,
				...action.config,
			},
			...state,
		}
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

export const isShowingAppsMenu = ( state = false, action ) => {
	switch ( action.type ) {
	case 'SET_IS_SHOWING_APPS_MENU':
		return action.isShowing
	default:
		return state
	}
}

export const appOrder = ( state = [], action ) => {
	switch ( action.type ) {
	case 'REGISTER_APP':
	case 'SET_APP_POSITION': {
		const { key, position = null } = action

		if ( null === position ) {
			const newState = Array.from( state )
			if ( -1 === newState.indexOf( key ) ) {
				newState.push( key )
			}
			return newState

		} else if ( false === position ) {

			const index = state.indexOf( key )
			if ( index ) {
				const newState = Array.from( state )
				delete newState[ index ]
				return newState
			}

		} else {
			const from = state.indexOf( key )
			const to = position

			const move = function( arr, from, to ) {
				arr.splice( to, 0, arr.splice( from, 1 )[0] )
				return arr
			}

			const newState = Array.from( move( state, from, to ) )
			return newState
		}
		break
	}
	default:
		return state
	}
}

export const counts = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'SET_COUNTS':
		return { ...state, ...action.counts }
	case 'SET_COUNT':
		return {
			...state,
			[ action.key ]: action.count
		}
	case 'INCREMENT_COUNT':
		return {
			...state,
			[ action.key ]: state[ action.key ] + 1
		}
	case 'DECREMENT_COUNT':
		return {
			...state,
			[ action.key ]: state[ action.key ] ? state[ action.key ] - 1 : 0
		}
	default:
		return state
	}
}


// New UI
const windowDefaults = {
	origin: [ 1, 1 ],
	size: 'mini',
	isHidden: false,
}
export const window = ( state = windowDefaults, action ) => {
	switch ( action.type ) {
	case 'SET_WINDOW':
		return {
			origin: state.origin,
			size: state.size,
			isHidden: state.isHidden,
			...action.config,
		}
	default:
		return state
	}
}

const defaultAppearance = {
	brightness: 'light',
}
export const appearance = ( state = defaultAppearance, action ) => {
	switch ( action.type ) {
	case 'SET_BRIGHTNESS':
		return {
			...state,
			brightness: action.brightness,
		}
	default:
		return state
	}
}
