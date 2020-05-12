import { registerStore, useStore, getStore, getDispatch, getSelectors } from '../registry'
import { getWpRest } from 'utils/wordpress'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import * as selectors from './selectors'
import useAppList from './use-app-list'

registerStore( 'fl-assistant/system', {
	state: {
		...FL_ASSISTANT_INITIAL_STATE,
		isAppHidden: __PRODUCTION__ ? true : false,
	},
	actions,
	reducers,
	effects,
	selectors,
} )

export const useSystemState = () => {
	return useStore( 'fl-assistant/system' )
}

export const getSystemStore = () => {
	return getStore( 'fl-assistant/system' )
}

export const getSystemActions = () => {
	return getDispatch( 'fl-assistant/system' )
}

export const getSystemSelectors = () => {
	return getSelectors( 'fl-assistant/system' )
}

export const getSystemConfig = () => {
	return { ...FL_ASSISTANT_CONFIG }
}

export { useAppList }

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
