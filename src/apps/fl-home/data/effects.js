import { getWpRest } from 'assistant/utils/wordpress'

const wpapi = getWpRest()

/**
 * Effects that take place after an action is dispatched
 */
export const after = {

	SET_CARDS: ( action, store ) => {
		const { pages } = store.getState()

		//wpapi.users().updateState( { homeCards: pages } )
	},
	CREATE_CARD: ( action, store ) => {
		const { pages } = store.getState()

		//wpapi.users().updateState( { homeCards: pages } )
	}
}
