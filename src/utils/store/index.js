import { applyMiddleware, combineReducers, createStore } from 'redux'
import camelCase from 'camelcase'
import { composeEnhancers, applyEffects } from './middleware'

const registry = {}

 /**
  * Addes a new store to the registry.
  *
  * Actions and reducers are optional! If you do not provide
  * an action or reducer for a state key, a setter will be
  * generated for you.
  */
export const registerStore = ( {
	key,
	state = {},
	actions = {},
	reducers = {},
	effects = {},
	storage = {},
} ) => {

	if ( ! key ) {
		throw new Error( 'Missing key required for registerStore.' )
	} else if ( registry[ key ] ) {
		throw new Error( `A store with the key '${ key }' already exists.` )
	}

	Object.entries( state ).map( ( [ key, value ] ) => {
		if ( ! reducers[ key ] ) {
			const { actionKey, action, reducer } = createAction( key, value )
			actions[ actionKey ] = action
			reducers[ key ] = reducer
		}
	} )

	registry[ key ] = {
		actions,
		store: createStore(
			combineReducers( reducers ),
			hydrateStateFromStorage( state, reducers, storage ),
			composeEnhancers( key, applyMiddleware( applyEffects( effects ) ) )
		)
	}
}

/**
 * Creates a default setter action and reducer for
 * a key/value pair.
 */
export const createAction = ( key, value ) => {
	const type = `SET_${ key.toUpperCase() }`
	const actionKey = camelCase( `set_${ key }` )

	const action = ( value ) => {
		return { type, value }
	}

	const reducer = ( state = value, action ) => {
		switch ( action.type ) {
		case type:
			return action.value
		default:
			return state
		}
	}

	return { actionKey, action, reducer }
}

/**
 * Hydrates initial state from storage.
 */
export const hydrateStateFromStorage = ( state, reducers, config ) => {
	return state
}

/**
 * Custom hook for subscribing local state to changes
 * in a registry store. Returns the store's state object.
 */
export const useStore = ( key ) => {
	const { store } = registry[ key ]
	const [ state, setState ] = useState( store.getState() )
	useEffect( () => {
		setState( store.getState() )
		const unsubscribe = store.subscribe( () => setState( store.getState() ) )
		return () => unsubscribe()
	}, [] )
	return { ...state }
}

/**
 * Returns the main object for a store in the registry.
 */
export const getStore = ( key ) => {
	const { store } = registry[ key ]
	return store
}

/**
 * Returns an object with all actions bound to dispatch
 * for a store in the registry.
 */
export const getDispatch = ( key ) => {
	const { actions, store } = registry[ key ]
	return bindActionCreators( actions, store.dispatch )
}
