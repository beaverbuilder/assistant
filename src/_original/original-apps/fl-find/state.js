import { getSystemConfig } from 'data'
import { getWeek } from 'shared-utils/datetime'

const { contentTypes } = getSystemConfig()

export const initialState = {
	query: {
		post_type: contentTypes.page ? 'page' : 'post',
		orderby: 'title',
		order: 'ASC',
		post_status: 'any',
	},
	filter: {
		type: 'posts',
		subType: contentTypes.page ? 'page' : 'post',
		date: '',
		status: 'any',
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
			values: {
				type: type[0],
				subType: type[1],
			},
		}
	},

	setDate( date ) {
		return {
			type: 'SET_FILTER',
			values: { date },
		}
	},

	setStatus( status ) {
		return {
			type: 'SET_FILTER',
			values: { status },
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
		const now = new Date()

		switch ( action.type ) {
		case 'SET_QUERY':
			switch ( args.type ) {
			case 'posts':
				query.post_type = args.subType
				query.orderby = 'title'
				query.order = 'ASC'
				query.s = ''
				query.post_status = 'attachment' === args.subType ? 'any' : args.status
				switch ( args.date ) {
				case 'today':
					query.year = now.getFullYear()
					query.month = now.getMonth() + 1
					query.day = now.getDate()
					break
				case 'week':
					query.year = now.getFullYear()
					query.w = getWeek( now )
					break
				case 'month':
					query.year = now.getFullYear()
					query.month = now.getMonth() + 1
					break
				case 'year':
					query.year = now.getFullYear()
					break
				}
				break
			case 'terms':
				query.taxonomy = args.subType
				query.hide_empty = 0
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
			const { type, subType, date, status } = filter
			store.dispatch( {
				type: 'SET_QUERY',
				args: { type, subType, date, status },
			} )
		}
	}
}
