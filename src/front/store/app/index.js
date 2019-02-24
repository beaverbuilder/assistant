import { useContext } from 'react'
import { getCache, setCache } from 'utils/cache'
import { registerStore, useStore, getStore, getDispatch } from 'utils/store'
import { AppContext } from 'components'

export const registerAppStore = args => {
	const { key, state, actions, reducers, effects } = args
	const storeKey = `${ key }/state`
	const cache = getCache( 'app-state', key )

	registerStore( storeKey, {
		state: cache ? { ...state, ...cache } : state,
		actions,
		reducers,
		effects,
	} )

	getStore( storeKey ).subscribe( () => {
		setCache( 'app-state', key, getStore( storeKey ).getState(), false )
	} )
}

export const useAppState = ( key ) => {
	const app = key ? key : useContext( AppContext ).app
	return useStore( `${ app }/state` )
}

export const getAppActions = ( key ) => {
	const app = key ? key : useContext( AppContext ).app
	return getDispatch( `${ key ? key : app }/state` )
}
