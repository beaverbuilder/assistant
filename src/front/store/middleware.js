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
