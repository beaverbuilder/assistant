import md5 from 'md5'

const uuid = () => md5( Math.random() )

const defaultWidgetType = {
	title: 'Untitled Widget',
	render: () => null,
	defaultSize: 'med',
	supportsSizes: [ 'sm', 'med', 'lg' ]
}

const defaultWidget = {
	id: null,
	size: 'med',
	type: '',
	settings: {}
}

/**
* Types stores registered widget type objects
*/
export const types = ( state = {}, action ) => {

	switch ( action.type ) {
	case 'REGISTER_WIDGET':
		return {
			...state,
			[ action.handle ]: { ...defaultWidgetType, ...action.config }
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
	case 'INSERT_WIDGET':
		return {
			...state,
			[ action.layout ]: [
				{
					...defaultWidget,
					id: uuid(),
					type: action.config.type,
					size: 'size' in action.config ? action.config.size : defaultWidget.size,
					setting: 'settings' in action.config ? action.config.settings : defaultWidget.settings
				},
				...state[ action.layout ]
			]
		}
	case 'DELETE_WIDGET':
		const i = state[ action.layout ].findIndex( item => item.id === action.id )
		if ( -1 !== i ) {
			const layout = [ ...state[ action.layout ] ]
			layout.splice( i, 1 )
			return {
				...state,
				[ action.layout ]: layout
			}
		}
		return state
	default:
		return state
	}
}
