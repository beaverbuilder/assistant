import { App } from '@beaverbuilder/app-core'
import { registerStore, useStore, getStore, getDispatch, getSelectors, getHooks } from '../registry'
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
		serialize = state => state
	} = args

	const storeKey = `${ key }/state`
	const state = {
		...defaultState,
		...initialState,
	}

	registerStore( storeKey, {
		state,
		actions: { ...defaultActions, ...actions },
		reducers: { ...defaultReducers, ...reducers },
		effects: { ...defaultEffects, ...effects },
	} )
}

export const getAppStore = key => getStore( `${ key }/state` )

export const getAppState = ( key ) => {
	const app = key ? key : App.use().handle
	return getStore( `${ app }/state` ).getState()
}

export const useAppState = ( key, needsRender = true ) => {
	const app = key ? key : App.use().handle
	return useStore( `${ app }/state`, needsRender )
}

export const getAppActions = ( key ) => {
	const app = key ? key : App.use().handle
	return getDispatch( `${ key ? key : app }/state` )
}

export const getAppSelectors = ( key ) => {
	const app = key ? key : App.use().handle
	return getSelectors( `${ key ? key : app }/state` )
}

export const getAppHooks = ( key ) => {
	const app = key ? key : App.use().handle
	return getHooks( `${ key ? key : app }/state` )
}
