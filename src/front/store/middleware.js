import { compose } from 'redux'
import effects from './effects'

export const applyEffects = store => {
	const { before, after } = effects
	return next => action => {
		if ( before[ action.type ] ) {
			before[ action.type ]( action, store )
		}
		const result = next( action )
		if ( after[ action.type ] ) {
			after[ action.type ]( action, store )
		}
		return result
	}
}

/**
 * Dev tools composer
 */
export const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( { name: 'Assistant' } ) || compose
