import { compose } from 'redux'

/**
 * Enhanced compose for when dev tools is available.
 */
export const composeEnhancers = ( name, enhancers ) => {
	const devToolsCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	const composeEnhancers = devToolsCompose ? devToolsCompose( { name } ) : compose
	return composeEnhancers( enhancers )
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
