import { __ } from '@wordpress/i18n'
import {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors
} from 'assistant/data'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import {
	defaultPageKey,
	defaultPage,
} from './defaults'

const STORE_KEY = 'fl-assistant/cards'

registerStore( STORE_KEY, {
	state: {
		types: {},
		pages: {
			[defaultPageKey]: { ...defaultPage }
		},
		defaultPage: defaultPageKey,
		currentPage: defaultPageKey,
	},
	actions,
	reducers,
	effects,
	selectors,
} )

export const useCardsState = () => useStore( STORE_KEY )

export const getCardsStore = () => getStore( STORE_KEY )

export const getCardsActions = () => getDispatch( STORE_KEY )

export const getCardsSelectors = () => getSelectors( STORE_KEY )
