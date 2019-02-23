import { useContext } from 'react'
import { registerStore, useStore, getStore, getDispatch } from 'utils/store'
import * as actions from './actions'
import * as reducers from './reducers'
import * as effects from './effects'
import { AppContext } from 'components'

registerStore( {
	key: 'fl-assistant/system',
	state: FL_ASSISTANT_INITIAL_STATE,
	actions,
	reducers,
	effects,
} )

export const useSystemState = () => {
	return useStore( 'fl-assistant/system' )
}

export const getSystemStore = () => {
	return getStore( 'fl-assistant/system' )
}

export const getSystemDispatch = () => {
	return getDispatch( 'fl-assistant/system' )
}

export const getSystemConfig = () => {
	return { ...FL_ASSISTANT_CONFIG }
}
