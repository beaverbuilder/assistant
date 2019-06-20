import { registerAppStore } from '../app'
import { updateUserState } from 'shared-utils/wordpress'

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

	SET_SHOULD_REDUCE_MOTION: ( action, store ) => {
		const { shouldReduceMotion } = store.getState()
		updateUserState( { shouldReduceMotion } )
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

	SET_SHOULD_SHOW_LABELS: ( action, store ) => {
		const { shouldShowLabels } = store.getState()
		updateUserState( { shouldShowLabels } )
	},

	SET_HISTORY: ( action, store ) => {
		const { history } = store.getState()
		updateUserState( { history } )
	},
}
