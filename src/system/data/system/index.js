import { registerStore, useStore, getStore, getDispatch, getSelectors } from '../registry'
import { getWpRest } from 'utils/wordpress'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import useAppList from './use-app-list'
import useAppOrder from './use-app-order'
import generateHooks from './generate-hooks'

const KEY = 'fl-assistant/system'

registerStore( KEY, {
	state: {
		...FL_ASSISTANT_INITIAL_STATE,

		// Don't hide apps by default while we're working
		isAppHidden: __PRODUCTION__ ? true : false,
	},
	actions,
	reducers,
	effects,
	selectors,
} )

export const useSystemState = () => useStore( KEY )

export const getSystemStore = () => getStore( KEY )

export const getSystemActions = () => getDispatch( KEY )

export const getSystemSelectors = () => getSelectors( KEY )

export const getSystemHooks = () => generateHooks( getStore( KEY ), getDispatch( KEY ) )

export const getSystemConfig = () => ({ ...FL_ASSISTANT_CONFIG })

export { useAppList, useAppOrder }

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
