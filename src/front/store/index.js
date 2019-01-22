import { useEffect, useState } from 'react'
import { createStore } from 'redux'
import reducers from './reducers'

const store = createStore( reducers, {
	activeApp: 'fl-navigate',
	apps: {},
	...FLAssistantInitialData,
} )

export const useStore = () => {
	const [ state, setState ] = useState( store.getState() )
	const unsubscribe = store.subscribe( () => setState( store.getState() ) )
	useEffect( () => () => unsubscribe() )
	return state
}

export default store
