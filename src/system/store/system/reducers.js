export const apps = ( state = {}, action ) => {

	const defaults = {
		app: null,
		label: null,
		isEnabled: true,
		icon: null,
		appearance: 'normal',
	}

	switch ( action.type ) {
	case 'REGISTER_APP':
		return {
			[action.key]: {
				...defaults,
				app: action.key,
				label: action.key,
				shouldShowInAppList: true,
				...action.config,
			},
			...state,
		}
	default:
		return state
	}
}

export const appOrder = ( state = [], action ) => {
	switch ( action.type ) {
	case 'REGISTER_APP':
	case 'SET_APP_POSITION': {
		const {key, position = null} = action

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
				delete newState[index]
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
		return {...state, ...action.counts}
	case 'SET_COUNT':
		return {
			...state,
			[action.key]: action.count
		}
	case 'INCREMENT_COUNT':
		return {
			...state,
			[action.key]: state[action.key] + 1
		}
	case 'DECREMENT_COUNT':
		return {
			...state,
			[action.key]: state[action.key] ? state[action.key] - 1 : 0
		}
	default:
		return state
	}
}

export const shouldReduceMotion = ( state = false, action ) => {
	switch ( action.type ) {
	case 'SET_SHOULD_REDUCE_MOTION':
		return action.shouldReduce ? true : false
	default:
		return state ? true : false
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

export const shouldShowLabels = ( state = true, action ) => {
	switch ( action.type ) {
	case 'SET_SHOULD_SHOW_LABELS':
		return action.show ? true : false
	default:
		return state ? true : false
	}
}

// Navigation History
const defaultHistory = {index: 0, entries: []}

export const history = ( state = defaultHistory, action ) => {
	switch ( action.type ) {
	case 'SET_HISTORY':
		return {
			index: action.index,
			entries: action.entries,
		}
	default:
		return state
	}
}

export const searchHistory = ( state = [], action ) => {
	switch ( action.type ) {
	case 'SET_SEARCH_HISTORY':
		return [ action.keyword, ...state.filter( item => item !== action.keyword ) ]
	default:
		return state
	}
}

export const isCloudConnected = ( state = false, action ) => {
	switch ( action.type ) {
	case 'SET_IS_CLOUD_CONNECTED':
		return action.isCloudConnected
	default:
		return state
	}
}

export const cloudToken = ( state = {}, action ) => {
	switch ( action.type ) {
	case 'SET_CLOUD_TOKEN':
		return action.token
	default:
		return state
	}
}

export const loginErrors = ( state = [], action ) => {
	switch ( action.type ) {
	case 'SET_LOGIN_ERRORS':
		return action.errors
	default:
		return state
	}
}

export const currentUser = ( state = null, action ) => {
	switch ( action.type ) {
	case 'SET_CURRENT_USER':
		return action.user
	default:
		return null
	}
}
