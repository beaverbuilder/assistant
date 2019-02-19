import { hydrateAppState, setAppFrameSize } from 'store/actions'
import { updateUserState } from 'utils/wordpress'

export default {
	REGISTER_APP: ( action, store ) => {
		const { apps, activeApp } = store.getState()
		const storage = localStorage.getItem( `fl-assistant-app-${ action.key }` )

		if ( storage ) {
			store.dispatch( hydrateAppState( action.key, JSON.parse( storage ) ) )
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
		localStorage.setItem( `fl-assistant-app-${ action.app }`, JSON.stringify( appState[ action.app ] ) )
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
