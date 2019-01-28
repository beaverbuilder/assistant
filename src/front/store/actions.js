export const registerApp = ( key, config ) => {
	return {
		type: 'REGISTER_APP',
		key,
		config,
	}
}

export const setActiveApp = ( key ) => {
	return {
		type: 'SET_ACTIVE_APP',
		key,
	}
}

export const setShowUI = ( show ) => {
	return {
		type: 'SET_SHOW_UI',
		show,
	}
}
