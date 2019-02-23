export const state = {
	query: null,
	filter: {
		type: 'posts',
		subType: 'page',
		date: '',
		status: 'publish',
	},
}

export const actions = {
	setFilter( key, value ) {
		return {
			type: 'SET_FILTER',
			key,
			value,
		}
	}
}

export const reducers = {
	filter( state = {}, action ) {
		switch ( action.type ) {
		case 'SET_FILTER':
			return { ...state, ...action.value }
		default:
			return state
		}
	}
}
