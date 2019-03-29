
export const defaultState = {
	isAppHeaderExpanded: false,
	isFirstTime: false,
}

export const defaultActions = {

	setIsAppHeaderExpanded( value = false ) {
		return {
			type: 'SET_IS_APP_HEADER_EXPANDED',
			value,
		}
	},

	setIsFirstTime( value = false ) {
		return {
			type: 'SET_IS_FIRST_TIME',
			value,
		}
	}
}

export const defaultReducers = {

	isAppHeaderExpanded( state = false, action ) {
		switch ( action.type ) {
		case 'SET_IS_APP_HEADER_EXPANDED':
			return action.value
		default:
			return state
		}
	},

	isFirstTime( state = false, action ) {
		switch ( action.type ) {
		case 'SET_IS_FIRST_TIME':
			return action.value
		default:
			return state
		}
	},
}

export const defaultEffects = {}
