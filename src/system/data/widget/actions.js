
export const registerWidget = ( handle, config ) => ( {
	type: 'REGISTER_WIDGET',
	handle,
	config,
} )

export const setLayout = ( layout, widgets ) => ( {
	type: 'SET_WIDGETS',
	layout,
	widgets
} )

export const insertWidget = ( layout, config, position = null ) => ( {
	type: 'INSERT_WIDGET',
	layout,
	config,
	position
} )

export const deleteWidget = ( layout, id ) => ( {
	type: 'DELETE_WIDGET',
	layout,
	id
} )
