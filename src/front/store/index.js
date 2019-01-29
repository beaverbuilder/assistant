import { useEffect, useState } from 'react'
import { createStore, applyMiddleware, bindActionCreators, compose } from 'redux'
import { applyEffects } from './middleware'
import reducers from './reducers'
import * as actions from './actions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( { name: 'Assistant' } ) || compose

const store = createStore( reducers, {
	apps: {},
	...FLAssistantInitialData,
}, composeEnhancers( applyMiddleware( applyEffects ) ) )

export const useStore = () => {
	const [ state, setState ] = useState( store.getState() )
	const unsubscribe = store.subscribe( () => setState( store.getState() ) )
	useEffect( () => () => unsubscribe() )
	return state
}

export const useDispatch = () => {
	return bindActionCreators( actions, store.dispatch )
}

export default store
