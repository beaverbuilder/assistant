import { useState, useLayoutEffect } from 'react'
import { shouldUpdate } from './'

const capitalize = string => string.charAt( 0 ).toUpperCase() + string.slice( 1 )

export default ( store, actions ) => {
	const state = store.getState()
	const hooks = {}

	Object.keys( state ).map( key => {
		const name = `use${ capitalize( key ) }`

		// Create a hook function named use{KeyName}()
		hooks[name] = ( needsRender = true ) => {

			const [ value, setValue ] = useState( store.getState()[key] )

			useLayoutEffect( () => {

				// Set initial value from store - overrides default value
				setValue( store.getState()[key] )

				return store.subscribe( () => {
					const state = store.getState()

					if ( shouldUpdate( needsRender, value, state[key] ) ) {
						setValue( state[key] )
					}
				} )
			}, [] )

			const actionName = `set${capitalize( key )}`
			let action = actions[actionName]

			if ( 'undefined' === typeof action ) {

				action = value => store.dispatch({
					type: `SET_VALUE_FOR_KEY`,
					key,
					value,
				})
			}

			return [ value, action ]
		}
	} )

	return hooks
}
