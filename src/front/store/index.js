import { useEffect, useState } from 'react'
import { createStore } from 'redux'
import reducers from './reducers'

const store = createStore( reducers, {
	activeApp: 'fl-navigate',
	apps: {},
	...FLAssistantInitialData,
} )

export const useStore = ( key ) => {
	const [ value, setValue ] = useState( store.getState()[ key ] )

	const unsubscribe = store.subscribe( () => {
		setValue( store.getState()[ key ] )
	} )

	useEffect( () => {
		return () => unsubscribe()
	} )

	return value
}

export default store
