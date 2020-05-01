import { isEqual } from 'lodash'
import { useState, useLayoutEffect } from 'react'

const _hasChanged = ( a, b ) => ! isEqual( a, b )

const capitalize = string => string.charAt( 0 ).toUpperCase() + string.slice( 1 )

export default ( getStore, getActions ) => {
	const store = getStore()
	const state = store.getState()
	const hooks = {}

	Object.keys( state ).map( key => {
		const name = `use${ capitalize( key ) }`
		hooks[name] = ( initial, hasChanged = _hasChanged ) => {

			const [ value, setValue ] = useState( initial )

			useLayoutEffect( () => {

				// Set initial value from store - overrides default value
				setValue( store.getState()[key] )

				return store.subscribe( () => {
					const state = store.getState()

					if ( hasChanged( value, state[key] ) ) {
						setValue( state[key] )
					}
				} )
			}, [] )

			const actions = getActions()
			const actionName = `set${capitalize( key )}`
			const setter = actions[actionName]

			return [ value, setter ]
		}
	} )

	return hooks
}
