import effects from './effects'

export const applyEffects = ( { getState } ) => {
	return next => action => {
		if ( effects[ action.type ] ) {
			effects[ action.type ]( action )
		}
		return next( action )
	}
}
