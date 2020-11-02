import {
	registerStore,
	useStore,
	getStore,
	getDispatch
} from '../registry'

import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'

const KEY = 'fl-assistant/widgets'

const defaultLayout = [
	{
		id: 1,
		size: 'sm',
		type: 'counts',
	},
	{
		id: 3,
		size: 'sm',
		type: 'media',
		settings: {}
	},
	{
		id: 4,
		size: 'lg',
		type: 'currently-viewing',
		settings: {}
	},
	{
		id: 5,
		size: 'lg',
		type: 'recent-posts',
		settings: {}
	},
	{
		id: 7,
		size: 'lg',
		type: 'apps'
	},
	{
		id: 6,
		size: 'lg',
		type: 'asst-email-signup'
	}
]

registerStore( KEY, {
	state: {
		types: {},
		layouts: {
			default: [ ...defaultLayout ],
			home: [ ...defaultLayout ],
		}
	},
	actions,
	reducers,
	effects,
	selectors,
} )

export const getWidgetStore = () => getStore( KEY )

export const useWidgetState = shouldUpdate => useStore( KEY, shouldUpdate )

export const getWidgetState = () => getStore( KEY ).getState()

export const getWidgetActions = () => getDispatch( KEY )
