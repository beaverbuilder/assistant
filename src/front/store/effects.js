import { hydrateAppState, setPanelPosition } from 'store/actions'
import { updateUserState } from 'utils/rest-api'

export default {
	REGISTER_APP: ( { key }, { dispatch } ) => {
		let storage = localStorage.getItem( `fl-assistant-app-${ key }` )
		if ( storage ) {
			dispatch( hydrateAppState( key, JSON.parse( storage ) ) )
		}
	},

	SET_ACTIVE_APP: action => {
		updateUserState( { activeApp: action.key } )
	},

	SET_APP_STATE: ( action, store ) => {
		const { appState } = store.getState()
		localStorage.setItem( `fl-assistant-app-${ action.app }`, JSON.stringify( appState[ action.app ] ) )
	},

	SET_SHOW_UI: action => {
		updateUserState( { isShowingUI: action.show } )
	},

	SET_PANEL_POSITION: ( action, store ) => {
		updateUserState( { panelPosition: action.position } )
	},

	TOGGLE_PANEL_POSITION: ( action, store ) => {
		const { panelPosition } = store.getState()
		updateUserState( { panelPosition } )
	},
}
