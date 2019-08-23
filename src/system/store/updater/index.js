import { setCache, getCache } from 'shared-utils/cache'
import { registerStore, getStore, getDispatch, getSelectors } from 'shared-utils/store'
import { updatePlugin, updateTheme } from 'shared-utils/wordpress'

const STORE_KEY = 'fl-updater/state'
const cache = getCache( 'updater', 'state' )

const state = {
	currentUpdate: null,
	updateQueue: {},
}

const actions = {
	setUpdateQueue( queue ) {
		return {
			type: 'SET_UPDATE_QUEUE',
			queue,
		}
	},
	setUpdateQueueItem( item ) {
		return {
			type: 'SET_UPDATE_QUEUE_ITEM',
			item,
		}
	},
	setUpdateQueueItems( items ) {
		return {
			type: 'SET_UPDATE_QUEUE_ITEMS',
			items,
		}
	}
}

const reducers = {
	updateQueue( state = {}, action ) {
		switch ( action.type ) {
		case 'SET_UPDATE_QUEUE':
			return { ...action.queue }
		case 'SET_UPDATE_QUEUE_ITEM':
			return { ...state, [ action.item.key ]: action.item }
		case 'SET_UPDATE_QUEUE_ITEMS':
			action.items.map( item => state[ item.key ] = item )
			return state
		default:
			return state
		}
	}
}

const selectors = {
	getQueuedUpdate( state, key ) {
		const { updateQueue } = state
		return 'undefined' === typeof updateQueue[ key ] ? null : updateQueue[ key ]
	}
}

registerStore( STORE_KEY, {
	state: cache ? { ...state, ...cache } : state,
	actions,
	reducers,
	selectors,
} )

getStore( STORE_KEY ).subscribe( () => {
	const state = getStore( STORE_KEY ).getState()
	const { currentUpdate, updateQueue } = state
	const { setCurrentUpdate, setUpdateQueue } = getDispatch( STORE_KEY )
	const items = Object.values( updateQueue )
	const updateComplete = () => {
		delete updateQueue[ currentUpdate ]
		setUpdateQueue( updateQueue )
		setCurrentUpdate( null )
	}

	if ( ! currentUpdate && items.length ) {
		const item = items[ 0 ]
		setCurrentUpdate( item.key )
		if ( 'plugin' === item.type ) {
			updatePlugin( item.key ).finally( updateComplete )
		} else {
			updateTheme( item.key ).finally( updateComplete )
		}
	}

	setCache( 'updater', 'state', state, false )
} )

export const useUpdaterState = () => {
	return useStore( STORE_KEY )
}

export const getUpdaterStore = () => {
	return getStore( STORE_KEY )
}

export const getUpdaterActions = () => {
	return getDispatch( STORE_KEY )
}

export const getUpdaterSelectors = () => {
	return getSelectors( STORE_KEY )
}
