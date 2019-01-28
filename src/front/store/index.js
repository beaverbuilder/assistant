import { useEffect, useState } from 'react'
import { createStore, applyMiddleware, bindActionCreators, compose } from 'redux'
import { applyEffects } from './middleware'
import reducers from './reducers'
import * as actions from './actions'

const store = createStore( reducers, {
	apps: {},
	...FLAssistantInitialData,
}, compose(
		applyMiddleware(applyEffects),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
			name: 'Assistant'
		})
   )
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
