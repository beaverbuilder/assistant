import { registerAppStore } from '../app'
import { getWpRest } from 'utils/wordpress'

const wpapi = getWpRest()

/**
 * Effects that fire before an action.
 */
export const before = {

	REGISTER_APP: ( action ) => {
		if ( action.config.state && false !== action.config.enabled ) {
			registerAppStore( {
				key: action.key,
				...action.config,
			} )
		}
	},
}

/**
 * Effects that fire after an action.
 */
export const after = {

	SET_APP_POSITION: ( action, store ) => {
		const { appOrder } = store.getState()
		wpapi.users().updateState( { appOrder } )
	},

	RESET_APP_ORDER: ( action, store ) => {
		const { appOrder } = store.getState()
		wpapi.users().updateState( { appOrder } )
	},

	SET_WINDOW: ( action, store ) => {
		const { window } = store.getState()
		wpapi.users().updateState( { window } )
	},

	SET_BRIGHTNESS: ( action, store ) => {
		const { appearance } = store.getState()
		wpapi.users().updateState( { appearance } )
	},

	SET_SHOULD_SHOW_LABELS: ( action, store ) => {
		const { shouldShowLabels } = store.getState()
		wpapi.users().updateState( { shouldShowLabels } )
	},

	SET_HISTORY: ( action, store ) => {
		const { history } = store.getState()
		wpapi.users().updateState( { history } )
	},

	SET_CURRENT_HISTORY_STATE: ( action, store ) => {
		const { history } = store.getState()
		wpapi.users().updateState( { history } )
	},

	SET_SEARCH_HISTORY: ( action, store ) => {
		const { searchHistory } = store.getState()
		wpapi.users().updateState( { searchHistory } )
	},
	RESET_SEARCH_HISTORY: ( action, store ) => {
		const { searchHistory } = store.getState()
		wpapi.users().updateState( { searchHistory } )
	},

	TOGGLE_IS_SHOWING_UI: ( action, store ) => {
		const { window } = store.getState()
		const newWindow = { ...window }
		delete newWindow.hiddenAppearance
		wpapi.users().updateState( { window: newWindow } )
	},

	SET_IS_APP_HIDDEN: ( action, store ) => {
		const { isAppHidden } = store.getState()
		wpapi.users().updateState( { isAppHidden } )
	},
}
