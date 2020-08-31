
const defaultWidget = {
	title: 'Untitled Widget',
	render: () => null,
	defaultSize: 'med',
	supportsSizes: [ 'sm', 'med', 'lg' ]
}

/**
* Types stores registered widget type objects
*/
export const types = ( state = {}, action ) => {

	switch ( action.type ) {
	case 'REGISTER_WIDGET':
		return {
			...state,
			[ action.handle ]: { ...defaultWidget, ...action.config }
		}
	default:
		return state
	}
}

/**
* Layouts are stored arrays of widget instances.
*/
export const layouts = ( state = {}, action ) => {

	switch ( action.type ) {
	case 'SET_WIDGETS':
		return {
			...state,
			[ action.layout ]: [ ...action.widgets ]
		}
	default:
		return state
	}
}
