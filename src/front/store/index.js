import { useEffect, useState, useContext } from 'react'
import { createStore, combineReducers, applyMiddleware, bindActionCreators } from 'redux'
import { applyEffects, composeEnhancers } from './middleware'
import * as reducers from './reducers'
import * as actions from './actions'
import { AppContext } from 'components'

const store = createStore( combineReducers( reducers ), {
	apps: {},
	appState: {},
	...( 'undefined' === typeof FL_ASSISTANT_INITIAL_STATE ? {} : FL_ASSISTANT_INITIAL_STATE ),
}, composeEnhancers( applyMiddleware( applyEffects ) ) )

/**
 * Custom hook for subscribing local state to changes
 * in the redux store. Returns the store's state object.
 */
export const useStore = () => {
	const [ state, setState ] = useState( store.getState() )
	const unsubscribe = store.subscribe( () => setState( store.getState() ) )
	useEffect( () => () => unsubscribe() )
	return state
}

/**
 * Custom hook for dispatching actions to the store.
 * Returns an object with all actions bound to dispatch.
 */
export const useDispatch = () => {
	return bindActionCreators( actions, store.dispatch )
}

/**
 * Custom hook for storing local app state values in the
 * store. This allows these values to persist between page
 * views as the app state is cached to local storage.
 */
export const useAppState = ( key, value ) => {
	const { appState } = useStore()
	const { app } = useContext( AppContext )
	const state = appState[ app ]
	return [
		state && undefined !== state[ key ] ? state[ key ] : value,
		newState => store.dispatch( actions.setAppState( app, key, newState ) )
	]
}

/**
 * Custom hook for accessing the global config object.
 */
export const useConfig = () => {
	return { ...FL_ASSISTANT_CONFIG }
}

export default store
