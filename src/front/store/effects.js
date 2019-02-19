import { hydrateAppState, clearAppState } from 'store/actions'
import { clearCache, getCache, setCache } from 'utils/cache'
import { updateUserState } from 'utils/wordpress'

export default {

	/**
	 * Effects that fire before an action.
	 */
	before: {
		SET_ACTIVE_APP: ( action, store ) => {
			const { activeApp } = store.getState()
			clearCache( 'app-state' )
			store.dispatch( clearAppState( activeApp ) )
		},
	},

	/**
	 * Effects that fire after an action.
	 */
	after: {
		REGISTER_APP: ( { key }, { dispatch } ) => {
			const cache = getCache( 'app-state', key )
			if ( cache ) {
				dispatch( hydrateAppState( key, JSON.parse( cache ) ) )
			}
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
		}
	}

}
