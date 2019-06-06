import { useContext } from 'fl-react'
import { AppContext } from 'shared-lib'
import { getCache, setCache } from 'utils/cache'
import { registerStore, useStore, getStore, getDispatch } from 'utils/store'
import {
	defaultState,
	defaultActions,
	defaultReducers,
	defaultEffects,
} from './defaults'

export const registerAppStore = args => {
	const {
		key,
		state: initialState,
		actions,
		reducers,
		effects,
	} = args

	const storeKey = `app:${ key }/state`
	const cache = getCache( 'app-state', key )
	const state = {
		...defaultState,
		...initialState,
	}

	registerStore( storeKey, {
		state: cache ? { ...state, ...cache } : state,
		actions: { ...defaultActions, ...actions },
		reducers: { ...defaultReducers, ...reducers },
		effects: { ...defaultEffects, ...effects },
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
