
const initial = {
	isFirstTime: true,
}

const actions = {
	setIsFirstTime( value = false ) {
		return {
			type: 'SET_IS_FIRST_TIME',
			value,
		}
	}
}

const reducers = {
	isFirstTime( state = initial.isFirstTime, action ) {
		switch ( action.type ) {
		case 'SET_IS_FIRST_TIME':
			return action.value
		default:
			return state
		}
	}
}

export default {
	state: initial,
	actions,
	reducers,
}
