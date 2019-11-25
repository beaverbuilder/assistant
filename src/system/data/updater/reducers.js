export const reducers = {
	updateQueue( state = {}, action ) {
		switch ( action.type ) {
		case 'SET_UPDATE_QUEUE':
			return { ...action.queue }
		case 'SET_UPDATE_QUEUE_ITEM':
			return { ...state, [ action.item.id ]: action.item }
		case 'SET_UPDATE_QUEUE_ITEMS':
			action.items.map( item => state[ item.id ] = item )
			return state
		default:
			return state
		}
	},
	completedUpdates( state = [], action ) {
		switch ( action.type ) {
		case 'SET_COMPLETED_UPDATES':
			return [ ...action.ids ]
		case 'REMOVE_COMPLETED_UPDATE':
			if ( state.includes( action.id ) ) {
				state.splice( state.indexOf( action.id ), 1 )
			}
			return [ ...state ]
		default:
			return state
		}
	}
}
