import { registerAppStore } from '../app'
import { updateUserState } from 'utils/wordpress'

/**
 * Effects that fire before an action.
 */
export const before = {

	REGISTER_APP: ( action ) => {
		registerAppStore( {
			key: action.key,
			...action.config,
		} )
	},
}

/**
 * Effects that fire after an action.
 */
export const after = {

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

	SET_ACTIVE_APP: ( action ) => {
		updateUserState( { activeApp: action.key } )
	},

	SET_APP_FRAME_SIZE: ( action, store ) => {
		const { appFrameSize } = store.getState()
		updateUserState( { appFrameSize } )
	},

	SET_APP_POSITION: ( action, store ) => {
		const { appOrder } = store.getState()
		updateUserState( { appOrder } )
	},

	SET_WINDOW: ( action, store ) => {
		const { window } = store.getState()
		updateUserState( { window: {...window} } )
	},
	SET_BRIGHTNESS: ( action, store ) => {
		const { appearance } = store.getState()
		updateUserState( { appearance } )
	},

	SET_HISTORY: ( action, store ) => {
		const { history } = store.getState()
		updateUserState( { history } )
	},
}
