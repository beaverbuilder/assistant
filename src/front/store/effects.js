import { hydrateAppState, clearAppState, setAppFrameSize } from 'store/actions'
import { clearCache, getCache, setCache } from 'utils/cache'
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
			const { apps, activeApp } = store.getState()
			const cache = getCache( 'app-state', action.key )

			if ( cache ) {
				store.dispatch( hydrateAppState( action.key, JSON.parse( cache ) ) )
			}
			if ( action.key === activeApp ) {
				store.dispatch( setAppFrameSize( apps[ activeApp ].size ) )
			}
		},

		SET_ACTIVE_APP: ( action, store ) => {
			const { apps, activeApp } = store.getState()
			store.dispatch( setAppFrameSize( apps[ activeApp ].size ) )
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
