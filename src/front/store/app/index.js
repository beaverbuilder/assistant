import { useContext } from 'react'
import { getCache, setCache } from 'utils/cache'
import { registerStore, useStore, getStore, getDispatch } from 'utils/store'
import { AppContext } from 'components'

export const registerAppStore = args => {
	const { key, state, actions, reducers, effects } = args
	const storeKey = `${ key }/state`
	const cache = getCache( 'app-state', key )

	registerStore( {
		key: storeKey,
		state: cache ? { ...state, ...cache } : state,
		actions,
		reducers,
		effects,
	} )

	getStore( storeKey ).subscribe( () => {
		setCache( 'app-state', key, getStore( storeKey ).getState(), false )
	} )
}

export const useAppState = () => {
	const { app } = useContext( AppContext )
	return useStore( `${ app }/state` )
}

export const getAppDispatch = () => {
	const { app } = useContext( AppContext )
	return getDispatch( `${ app }/state` )
}
