export const initialState = {
	query: {
		post_mime_type: 'image',
	},
	filter: {
		type: 'image',
	},
}

export const actions = {

	setFilter( values ) {
		return {
			type: 'SET_FILTER',
			values,
		}
	},

	setType( type ) {
		return {
			type: 'SET_FILTER',
			values: { type },
		}
	},
}

export const reducers = {

	filter( state = initialState.filter, action ) {
		switch ( action.type ) {
		case 'SET_FILTER':
			return {
				...( action.values.type ? initialState.filter : state ),
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
			query.post_mime_type = args.type
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
			const { type } = filter
			store.dispatch( {
				type: 'SET_QUERY',
				args: { type },
			} )
		}
	}
}
