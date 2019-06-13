export const initialState = {
	query: {},
	filter: {
		role: 'all',
	},
}

export const actions = {

	setFilter( values ) {
		return {
			type: 'SET_FILTER',
			values,
		}
	},

	setRole( role ) {
		return {
			type: 'SET_FILTER',
			values: { role },
		}
	},
}

export const reducers = {

	filter( state = initialState.filter, action ) {
		switch ( action.type ) {
		case 'SET_FILTER':
			return {
				...( action.values.role ? initialState.filter : state ),
				...action.values,
			}
		default:
			return state
		}
	},

	query( state = initialState.query, action ) {
		const { args } = action
		const query = {}

		switch ( action.type ) {
		case 'SET_QUERY':
			switch ( args.role ) {
			case 'all':
				break
			default:
				query.role = args.role
			}
			return query
		default:
			return state
		}
	},
}

export const effects = {

	after: {

		SET_FILTER( action, store ) {
			const { filter } = store.getState()
			const { role } = filter
			store.dispatch( {
				type: 'SET_QUERY',
				args: { role },
			} )
		}
	}
}
