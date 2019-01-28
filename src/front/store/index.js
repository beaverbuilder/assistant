import { useEffect, useState } from 'react'
import { createStore, applyMiddleware, bindActionCreators, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { applyEffects } from './middleware'
import reducers from './reducers'
import * as actions from './actions'

const store = createStore( reducers, {
	apps: {},
	...FLAssistantInitialData,
}, composeWithDevTools( applyMiddleware(applyEffects) )
)

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
