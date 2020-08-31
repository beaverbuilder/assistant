
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
