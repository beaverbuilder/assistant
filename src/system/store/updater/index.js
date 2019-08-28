import { setCache } from 'shared-utils/cache'
import { registerStore, getStore, getDispatch, getSelectors } from 'shared-utils/store'
import { updatePlugin, updateTheme } from 'shared-utils/wordpress'
import { getSystemActions } from '../system'
import { state } from './state'
import { actions } from './actions'
import { reducers } from './reducers'
import { selectors } from './selectors'

const STORE_KEY = 'fl-updater/state'

registerStore( STORE_KEY, {
	state,
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
	const { currentUpdate, updateQueue, completedUpdates } = getUpdaterStore().getState()
	const { setCurrentUpdate, setUpdateQueue, setCompletedUpdates } = getUpdaterActions()
	delete updateQueue[ currentUpdate ]
	completedUpdates.push( currentUpdate )
	setUpdateQueue( updateQueue )
	setCompletedUpdates( completedUpdates )
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
		setCurrentUpdate( item.id )
		if ( 'plugin' === item.type ) {
			updatePlugin( item.id ).finally( () => {
				updateComplete()
				decrementCount( 'update/plugins' )
				decrementCount( 'update/total' )
			} )
		} else {
			updateTheme( item.id ).finally( () => {
				updateComplete()
				decrementCount( 'update/themes' )
				decrementCount( 'update/total' )
			} )
		}
	}

	setCache( 'updater', 'queue', updateQueue, false )
}

getUpdaterStore().subscribe( requestUpdate )

requestUpdate()
