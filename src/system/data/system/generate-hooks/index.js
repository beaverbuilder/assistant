import { isEqual } from 'lodash'
import { useState, useEffect } from 'react'

const _hasChanged = ( a, b ) => ! isEqual( a, b )

const capitalize = string => string.charAt( 0 ).toUpperCase() + string.slice( 1 )

export default ( store, actions ) => {
	const state = store.getState()
	const hooks = {}

	Object.keys( state ).map( key => {
		const name = `use${ capitalize( key ) }`
		hooks[name] = ( initial, hasChanged = _hasChanged ) => {

			const [ value, setValue ] = useState( initial )

			useEffect( () => store.subscribe( () => {

				const state = store.getState()

				if ( hasChanged( value, state[key] ) ) {
					setValue( state[key] )
				}
			} ), [] )

			const actionName = `set${capitalize( key )}`
			const setter = actions[actionName]

			return [ value, setter ]
		}
	} )

	return hooks
}
