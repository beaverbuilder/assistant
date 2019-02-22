import { hydrateAppState, setAppFrameSize } from 'store/actions'
import { getCache, setCache } from 'utils/cache'
import { updateUserState } from 'utils/wordpress'

export default {

	/**
	 * Effects that fire before an action.
	 */
	before: {},

	/**
	 * Effects that fire after an action.
	 */
	after: {
		REGISTER_APP: ( action, store ) => {
			const { apps, activeApp, appState } = store.getState()
			const cache = getCache( 'app-state', action.key )
			const state = cache ? JSON.parse( cache ) : apps[ action.key ].state

			// Hydrate initial app state from cache or config.
			const newState = Object.assign( { size: 'normal' }, state )
			store.dispatch( hydrateAppState( action.key, newState ) )

			// Set the app frame size.
			if ( action.key === activeApp ) {
				store.dispatch( setAppFrameSize( newState.size ) )
			}
		},

		SET_ACTIVE_APP: ( action, store ) => {
			const { activeApp, appState } = store.getState()
			store.dispatch( setAppFrameSize( appState[ activeApp ].size ) )
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
		}
	}

}
