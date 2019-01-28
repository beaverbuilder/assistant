import { useEffect, useState } from 'react'
import { createStore, bindActionCreators } from 'redux'
import reducers from './reducers'
import * as actions from './actions'

const store = createStore( reducers, {
	activeApp: 'fl-dashboard',
	apps: {},
	...FLAssistantInitialData,
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
	name: 'Assistant'
}) )

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
