import { setCache } from 'shared-utils/cache'
import { registerStore, getStore, getDispatch, getSelectors, useStore } from 'shared-utils/store'
import { updatePlugin, updateTheme } from 'shared-utils/wordpress'
import { getSystemActions } from '../system'
import { state, cache } from './state'
import { actions } from './actions'
import { reducers } from './reducers'
import { selectors } from './selectors'

const STORE_KEY = 'fl-updater/state'

registerStore( STORE_KEY, {
	state: cache ? { ...state, ...cache } : state,
	actions,
	reducers,
	selectors,
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

const updateComplete = () => {
	const { currentUpdate, updateQueue } = getUpdaterStore().getState()
	const { setCurrentUpdate, setUpdateQueue } = getUpdaterActions()
	delete updateQueue[ currentUpdate ]
	setUpdateQueue( updateQueue )
	setCurrentUpdate( null )
}

const requestUpdate = () => {
	const state = getUpdaterStore().getState()
	const { currentUpdate, updateQueue } = state
	const { setCurrentUpdate } = getUpdaterActions()
	const { decrementCount } = getSystemActions()
	const items = Object.values( updateQueue )

	if ( ! currentUpdate && items.length ) {
		const item = items[ 0 ]
		setCurrentUpdate( item.key )
		if ( 'plugin' === item.type ) {
			updatePlugin( item.key ).then( () => {
				decrementCount( 'update/plugins' )
				decrementCount( 'update/total' )
			} ).finally( updateComplete )
		} else {
			updateTheme( item.key ).then( () => {
				decrementCount( 'update/themes' )
				decrementCount( 'update/total' )
			} ).finally( updateComplete )
		}
	}

	setCache( 'updater', 'state', state, false )
}

getUpdaterStore().subscribe( requestUpdate )

requestUpdate()
