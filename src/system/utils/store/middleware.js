import { applyMiddleware, compose } from 'redux'

/**
 * Creates all enhancers for a new store with support
 * for redux dev tools.
 */
export const createEnhancers = ( name, effects ) => {
	const devToolsCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	const composeEnhancers = devToolsCompose ? devToolsCompose( { name } ) : compose
	return composeEnhancers( applyMiddleware( applyEffects( effects ) ) )
}

/**
 * Applys before and after effects to store actions.
 */
export const applyEffects = effects => {
	const { before, after } = effects
	return store => {
		return next => action => {
			if ( before && before[ action.type ] ) {
				before[ action.type ]( action, store )
			}
			const result = next( action )
			if ( after && after[ action.type ] ) {
				after[ action.type ]( action, store )
			}
			return result
		}
	}
}
