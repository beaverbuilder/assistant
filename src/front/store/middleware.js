import { compose } from 'redux'
import effects from './effects'

export const applyEffects = store => {
	return next => action => {
		const result = next( action )
		if ( effects[ action.type ] ) {
			effects[ action.type ]( action, store )
		}
		return result
	}
}

/**
 * Dev tools composer
 */
export const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__( { name: 'Assistant' } ) || compose
