import { currentUserCan } from 'utils/wordpress'

export const initialState = {
	query: {
		commentStatus: 'all',
	},
	filter: {
		type: currentUserCan( 'moderate_comments' ) ? 'comments' : 'updates',
		commentStatus: 'all',
		updateType: 'all',
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

	setCommentStatus( commentStatus ) {
		return {
			type: 'SET_FILTER',
			values: { commentStatus },
		}
	},

	setUpdateType( updateType ) {
		return {
			type: 'SET_FILTER',
			values: { updateType },
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
			switch ( args.type ) {
			case 'comments':
				query.status = args.commentStatus
				break
			case 'updates':
				query.type = args.updateType
				break
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
			const { type, commentStatus, updateType } = filter
			store.dispatch( {
				type: 'SET_QUERY',
				args: { type, commentStatus, updateType },
			} )
		}
	}
}
