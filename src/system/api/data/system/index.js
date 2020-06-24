import {
	registerStore,
	useStore,
	getStore,
	getDispatch,
	getSelectors,
	getHooks
} from '../registry'
import getSystemHistory from './history'
import { getWpRest } from 'utils/wordpress'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import useAppList from './use-app-list'

const KEY = 'fl-assistant/system'

registerStore( KEY, {
	state: {
		...FL_ASSISTANT_INITIAL_STATE,
	},
	actions,
	reducers,
	effects,
	selectors,
} )

export const useSystemState = shouldUpdate => useStore( KEY, shouldUpdate )

export const getSystemStore = () => getStore( KEY )

export const getSystemActions = () => getDispatch( KEY )

export const getSystemSelectors = () => getSelectors( KEY )

export const getSystemHooks = () => getHooks( KEY )

export const getSystemConfig = () => ( { ...FL_ASSISTANT_CONFIG } )

export { useAppList, getSystemHistory }


// Set up Counts
getWpRest().batch().get( {
	'/fl-assistant/v1/counts': counts => {
		const { setCounts } = getSystemActions()
		setCounts( counts )
	},
	'/fl-assistant/v1/labels': labels => {
		const { setLabels } = getSystemActions()
		setLabels( labels )
	}
} )
