import { useEffect, useState, useContext } from 'react'
import { createStore, applyMiddleware, bindActionCreators } from 'redux'
import { applyEffects, composeEnhancers } from './middleware'
import reducers from './reducers'
import * as actions from './actions'
import { AppContext } from 'components'


const store = createStore( reducers, {
	apps: {},
	appState: {},
	...FLAssistantInitialData,
}, composeEnhancers( applyMiddleware( applyEffects ) ) )

// Custom React Hooks

export const useStore = () => {
	const [ state, setState ] = useState( store.getState() )
	const unsubscribe = store.subscribe( () => setState( store.getState() ) )
	useEffect( () => () => unsubscribe() )
	return state
}

export const useDispatch = () => {
	return bindActionCreators( actions, store.dispatch )
}

export const useAppState = ( key, value ) => {
	const { appState } = store.getState()
	const { app } = useContext( AppContext )
	const [ state, setState ] = useState(
		appState[ app ] && appState[ app ][ key ] ? appState[ app ][ key ] : value
	)
	return [ state, newState => {
		store.dispatch( actions.setAppState( app, key, newState ) )
		setState( newState )
	} ]
}

export default store
