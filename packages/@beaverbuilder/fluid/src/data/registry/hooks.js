import { useState, useLayoutEffect, useRef } from 'react'
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
			const prevValue = useRef( store.getState()[key] )

			useLayoutEffect( () => {

				// Set initial value from store - overrides default value
				setValue( store.getState()[key] )
				prevValue.current = store.getState()[key]

				return store.subscribe( () => {
					const state = store.getState()

					if ( shouldUpdate( needsRender, value, prevValue.current ) ) {
						setValue( state[key] )
					}
					prevValue.current = state[key]
				} )
			}, [] )

			const actionName = `set${capitalize( key )}`
			let action = actions[actionName]

			return [ value, action ]
		}
	} )

	return hooks
}
