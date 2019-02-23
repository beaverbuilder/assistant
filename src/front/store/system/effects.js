import { setAppState } from 'store/system/actions'
import { getCache, setCache } from 'utils/cache'
import { updateUserState } from 'utils/wordpress'

/**
 * Effects that fire before an action.
 */
export const before = {}

/**
 * Effects that fire after an action.
 */
export const after = {

	REGISTER_APP: ( action, store ) => {
		const { apps } = store.getState()
		const cache = getCache( 'app-state', action.key )
		const cacheState = cache ? JSON.parse( cache ) : {}
		const initialState = apps[ action.key ].state
		const appState = { ...initialState, ...cacheState }

		// Hydrate initial app state from cache and config.
		store.dispatch( setAppState( action.key, appState ) )
	},

	SET_ACTIVE_APP: ( action ) => {
		updateUserState( { activeApp: action.key } )
	},

	SET_APP_STATE: ( action, store ) => {
		const { appState } = store.getState()
		setCache( 'app-state', action.app, JSON.stringify( appState[ action.app ] ), false )
	},

	SET_SHOW_UI: action => {
		updateUserState( { isShowingUI: action.show } )
	},

	SET_PANEL_POSITION: ( action ) => {
		updateUserState( { panelPosition: action.position } )
	},

	TOGGLE_PANEL_POSITION: ( action, store ) => {
		const { panelPosition } = store.getState()
		updateUserState( { panelPosition } )
	},

	SET_SHOULD_REDUCE_MOTION: ( action, store ) => {
		const { shouldReduceMotion } = store.getState()
		updateUserState( { shouldReduceMotion } )
	},

	SET_APP_FRAME_SIZE: ( action, store ) => {
		const { appFrameSize } = store.getState()
		updateUserState( { appFrameSize } )
	},
}
