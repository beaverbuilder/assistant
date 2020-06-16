import { useEffect, useState, useRef } from 'react'
import { createStore, bindActionCreators } from 'redux'

import shouldUpdate from './should-update'
import { createActions } from './actions'
import { createReducers } from './reducers'
import { createSelectors } from './selectors'
import { createEnhancers } from './middleware'
import createHooks from './hooks'

const createStoreRegistry = () => {

	/**
	 * The main registry object. Holds all stores
	 * that have been registered.
	 */
	const registry = {}

	/**
	  * Functions for working with the registry.
	  */
	return {

		/**
		  * Addes a new store to the registry.
		  *
		  * Actions and reducers are optional! If you do not provide
		  * an action or reducer for a state key, a setter will be
		  * generated for you.
		  */
		registerStore: ( key, {
			state = {},
			actions = {},
			reducers = {},
			selectors = {},
			effects = {},
		} ) => {

			if ( ! key ) {
				throw new Error( 'Missing key required for registerStore.' )
			} else if ( registry[ key ] ) {
				throw new Error( `A store with the key '${ key }' already exists.` )
			}

			registry[ key ] = {
				actions: createActions( actions, reducers, state ),
				store: createStore(
					createReducers( reducers, state ),
					state,
					createEnhancers( key, effects )
				),
			}

			registry[ key ].selectors = createSelectors( selectors, registry[ key ].store )
		},

		/**
		 * Custom hook for subscribing local state to changes
		 * in a registry store. Returns the store's state object.
		 */
		useStore: ( key, needsRender = true ) => {
			const { store } = registry[ key ]
			const initial = store.getState()
			const prevState = useRef( initial )
			const [ state, setState ] = useState( initial )

			useEffect( () => {

				setState( store.getState() )

				return store.subscribe( () => {
					const newState = store.getState()
					if ( shouldUpdate( needsRender, prevState.current, newState ) ) {

						setState( { ...newState } )
					}
					prevState.current = newState
				} )

			}, [] )

			return state
		},

		/**
		 * Returns the main object for a store in the registry.
		 */
		getStore: ( key ) => {
			const { store } = registry[ key ]
			return store
		},

		/**
		 * Returns an object with all actions bound to dispatch
		 * for a store in the registry.
		 */
		getDispatch: ( key ) => {
			const { actions, store } = registry[ key ]
			return bindActionCreators( actions, store.dispatch )
		},

		/**
		 * Returns all selectors for a store in the registry.
		 */
		getSelectors: ( key ) => {
			const { selectors } = registry[ key ]
			return selectors
		},

		/**
		 * return all generated hooks for a store in the registry.
		 */
		getHooks: key => {
			const { actions, store } = registry[ key ]
			const actionCreators = bindActionCreators( actions, store.dispatch )
			return createHooks( store, actionCreators )
		}
	}
}

export default createStoreRegistry
